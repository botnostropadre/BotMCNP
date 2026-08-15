const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const db =
    require("../database/database");

const {
    ajustarFarm,
    obterPainelMembro
} = require("../services/farmService");

const {
    criarFarmEmbed
} = require("../embeds/farmEmbed");

// ======================================================
// CONSULTAR MEMBRO PELO ID DA CIDADE
// ======================================================

function buscarMembroPorIdCidade(
    idCidade
) {

    return new Promise(
        (resolve, reject) => {

            db.get(
                `
                    SELECT *
                    FROM membros
                    WHERE idCidade = ?
                    AND status = 'Ativo'
                    LIMIT 1
                `,
                [
                    String(idCidade)
                ],
                (
                    error,
                    row
                ) => {

                    if (error) {

                        return reject(
                            error
                        );

                    }

                    resolve(
                        row || null
                    );

                }
            );

        }
    );

}

// ======================================================
// FORMATAR DINHEIRO
// ======================================================

function formatarDinheiro(
    valor
) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style:
                "currency",

            currency:
                "BRL",

            maximumFractionDigits:
                0
        }
    );

}

// ======================================================
// COMANDO /EDITARFARM
// ======================================================

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                "editarfarm"
            )

            .setDescription(
                "Adiciona ou remove valores do farm de um integrante."
            )

            .addStringOption(
                option =>

                    option

                        .setName(
                            "id"
                        )

                        .setDescription(
                            "ID da cidade do integrante."
                        )

                        .setRequired(
                            true
                        )
            )

            .addStringOption(
                option =>

                    option

                        .setName(
                            "acao"
                        )

                        .setDescription(
                            "Escolha se deseja adicionar ou remover."
                        )

                        .setRequired(
                            true
                        )

                        .addChoices(
                            {
                                name:
                                    "➕ Adicionar",
                                value:
                                    "adicionar"
                            },
                            {
                                name:
                                    "➖ Remover",
                                value:
                                    "remover"
                            }
                        )
            )

            .addStringOption(
                option =>

                    option

                        .setName(
                            "tipo"
                        )

                        .setDescription(
                            "Selecione o tipo de farm."
                        )

                        .setRequired(
                            true
                        )

                        .addChoices(
                            {
                                name:
                                    "💳 Dados",
                                value:
                                    "dados"
                            },
                            {
                                name:
                                    "💵 Dinheiro Sujo",
                                value:
                                    "dinheiro"
                            }
                        )
            )

            .addIntegerOption(
                option =>

                    option

                        .setName(
                            "valor"
                        )

                        .setDescription(
                            "Valor que será adicionado ou removido."
                        )

                        .setRequired(
                            true
                        )

                        .setMinValue(
                            1
                        )
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

    async execute(
        interaction
    ) {

        await interaction.deferReply({
            flags:
                MessageFlags.Ephemeral
        });

        try {

            // ==================================================
            // OPÇÕES
            // ==================================================

            const idCidade =
                interaction.options
                    .getString(
                        "id"
                    )
                    .trim();

            const acao =
                interaction.options
                    .getString(
                        "acao"
                    );

            const tipo =
                interaction.options
                    .getString(
                        "tipo"
                    );

            const valor =
                interaction.options
                    .getInteger(
                        "valor"
                    );

            // ==================================================
            // LOCALIZAR MEMBRO
            // ==================================================

            const membroBanco =
                await buscarMembroPorIdCidade(
                    idCidade
                );

            if (
                !membroBanco
            ) {

                await interaction.editReply({

                    content:
                        `❌ Nenhum integrante ativo foi encontrado com o ID **${idCidade}**.`

                });

                return;

            }

            // ==================================================
            // AJUSTAR FARM
            // ==================================================

            const resumo =
                await ajustarFarm({

                    discordId:
                        membroBanco.discordId,

                    tipo,

                    acao,

                    valor

                });

            // ==================================================
            // ATUALIZAR PLANILHA INDIVIDUAL
            // ==================================================

            const painel =
                await obterPainelMembro(
                    membroBanco.discordId
                );

            if (
                painel?.canalId &&
                painel?.mensagemId
            ) {

                const canal =
                    interaction.guild.channels.cache.get(
                        painel.canalId
                    ) ||
                    await interaction.guild.channels
                        .fetch(
                            painel.canalId
                        )
                        .catch(
                            () => null
                        );

                if (
                    canal &&
                    canal.isTextBased()
                ) {

                    const mensagem =
                        await canal.messages
                            .fetch(
                                painel.mensagemId
                            )
                            .catch(
                                () => null
                            );

                    if (
                        mensagem
                    ) {

                        const nomeExibicao =
                            membroBanco.nome ||
                            `ID ${idCidade}`;

                        const embed =
                            criarFarmEmbed(
                                nomeExibicao,
                                resumo
                            );

                        await mensagem.edit({
                            embeds: [
                                embed
                            ]
                        });

                    }

                }

            }

            // ==================================================
            // RESPOSTA
            // ==================================================

            const tipoTexto =
                tipo ===
                "dados"
                    ? "💳 Dados"
                    : "💵 Dinheiro Sujo";

            const valorTexto =
                tipo ===
                "dados"

                    ? `${valor.toLocaleString(
                        "pt-BR"
                    )} unidades`

                    : formatarDinheiro(
                        valor
                    );

            const acaoTexto =
                acao ===
                "adicionar"
                    ? "adicionado"
                    : "removido";

            await interaction.editReply({

                content:
`✅ **Farm atualizado com sucesso**

👤 Integrante: **${membroBanco.nome}**
🆔 ID: **${idCidade}**

${tipoTexto}
Valor ${acaoTexto}: **${valorTexto}**

📊 A planilha do integrante foi atualizada automaticamente.`

            });

        } catch (error) {

            console.error(
                "Erro ao editar farm:",
                error
            );

            await interaction.editReply({

                content:
                    `❌ Não foi possível editar o farm.\n\n` +
                    `Erro: ${error.message}`

            }).catch(
                () => {}
            );

        }

    }

};