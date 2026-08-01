const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const db = require("../database/database");

const {
    resetarMembro,
    resetarTodos,
    obterResumoMembro,
    obterPainelMembro
} = require("../services/farmService");

const {
    criarFarmEmbed
} = require("../embeds/farmEmbed");

// ======================================================
// APAGAR RESPOSTA TEMPORÁRIA
// ======================================================

function apagarResposta(
    interaction,
    tempo = 10000
) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, tempo);

}

// ======================================================
// CONSULTAR TODOS OS PAINÉIS DE FARM
// ======================================================

function obterTodosPaineis() {

    return new Promise(
        (resolve, reject) => {

            db.all(
                `
                    SELECT *
                    FROM farmMembros
                    ORDER BY nomeExibicao ASC
                `,
                [],
                (error, rows) => {

                    if (error) {

                        return reject(error);

                    }

                    resolve(rows || []);

                }
            );

        }
    );

}

// ======================================================
// BUSCAR CANAL
// ======================================================

async function buscarCanal(
    interaction,
    canalId
) {

    if (!canalId) return null;

    return (
        interaction.guild.channels.cache.get(
            canalId
        ) ||
        await interaction.guild.channels
            .fetch(canalId)
            .catch(() => null)
    );

}

// ======================================================
// ATUALIZAR EMBED PELO PAINEL
// ======================================================

async function atualizarEmbedPainel(
    interaction,
    painel
) {

    if (
        !painel?.discordId ||
        !painel?.canalId ||
        !painel?.mensagemId
    ) {

        return false;

    }

    const canal = await buscarCanal(
        interaction,
        painel.canalId
    );

    if (
        !canal ||
        !canal.isTextBased()
    ) {

        return false;

    }

    const mensagem = await canal.messages
        .fetch(painel.mensagemId)
        .catch(() => null);

    if (!mensagem) {

        return false;

    }

    const resumo = await obterResumoMembro(
        painel.discordId
    );

    const nomeExibicao =
        painel.nomeExibicao ||
        `Integrante ${painel.discordId}`;

    await mensagem.edit({

        embeds: [

            criarFarmEmbed(
                nomeExibicao,
                resumo
            )

        ]

    });

    return true;

}

// ======================================================
// ATUALIZAR EMBED DE UM MEMBRO
// ======================================================

async function atualizarEmbedMembro(
    interaction,
    usuario
) {

    const painel = await obterPainelMembro(
        usuario.id
    );

    if (!painel) {

        return false;

    }

    return atualizarEmbedPainel(
        interaction,
        {
            ...painel,

            nomeExibicao:
                painel.nomeExibicao ||
                usuario.globalName ||
                usuario.username
        }
    );

}

// ======================================================
// ATUALIZAR TODOS OS EMBEDS
// ======================================================

async function atualizarTodosEmbeds(
    interaction
) {

    const paineis =
        await obterTodosPaineis();

    let atualizados = 0;
    let falhas = 0;

    for (const painel of paineis) {

        try {

            const atualizado =
                await atualizarEmbedPainel(
                    interaction,
                    painel
                );

            if (atualizado) {

                atualizados++;

            } else {

                falhas++;

            }

        } catch (error) {

            falhas++;

            console.error(
                `Erro ao atualizar o painel de farm de ${painel.discordId}:`,
                error
            );

        }

    }

    return {
        total: paineis.length,
        atualizados,
        falhas
    };

}

// ======================================================
// COMANDO /RESET
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("reset")

        .setDescription(
            "Zera os registros de farm."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addSubcommand(subcommand =>

            subcommand

                .setName("membro")

                .setDescription(
                    "Zera o farm de um integrante."
                )

                .addUserOption(option =>

                    option

                        .setName("integrante")

                        .setDescription(
                            "Selecione o integrante."
                        )

                        .setRequired(true)

                )

        )

        .addSubcommand(subcommand =>

            subcommand

                .setName("todos")

                .setDescription(
                    "Zera o farm de todos os integrantes."
                )

        ),

    async execute(interaction) {

        const subcomando =
            interaction.options.getSubcommand();

        // ==================================================
        // RESETAR UM MEMBRO
        // ==================================================

        if (subcomando === "membro") {

            const usuario =
                interaction.options.getUser(
                    "integrante"
                );

            await interaction.deferReply({
                flags: 64
            });

            try {

                const alterado =
                    await resetarMembro(
                        usuario.id
                    );

                const embedAtualizado =
                    await atualizarEmbedMembro(
                        interaction,
                        usuario
                    );

                let mensagem;

                if (alterado) {

                    mensagem =
                        `✅ O farm de ${usuario} foi zerado com sucesso.`;

                } else {

                    mensagem =
                        `⚠️ ${usuario} não possuía registros de farm para zerar.`;

                }

                if (!embedAtualizado) {

                    mensagem +=
                        "\n\n⚠️ O painel individual não foi encontrado ou não pôde ser atualizado.";

                }

                await interaction.editReply({
                    content: mensagem
                });

            } catch (error) {

                console.error(
                    "Erro ao resetar farm do membro:",
                    error
                );

                await interaction.editReply({

                    content:
                        "❌ Não foi possível zerar o farm desse integrante."

                });

            }

            apagarResposta(interaction);

            return;

        }

        // ==================================================
        // RESETAR TODOS
        // ==================================================

        if (subcomando === "todos") {

            await interaction.deferReply({
                flags: 64
            });

            try {

                const quantidadeRegistros =
                    await resetarTodos();

                const resultadoEmbeds =
                    await atualizarTodosEmbeds(
                        interaction
                    );

                let mensagem =
                    "✅ Reset geral concluído com sucesso.\n\n" +
                    `📦 Registros removidos: **${quantidadeRegistros}**\n` +
                    `📋 Painéis atualizados: **${resultadoEmbeds.atualizados}**`;

                if (resultadoEmbeds.falhas > 0) {

                    mensagem +=
                        `\n⚠️ Painéis não atualizados: **${resultadoEmbeds.falhas}**`;

                }

                await interaction.editReply({
                    content: mensagem
                });

            } catch (error) {

                console.error(
                    "Erro ao resetar todos os farms:",
                    error
                );

                await interaction.editReply({

                    content:
                        "❌ Não foi possível realizar o reset geral."

                });

            }

            apagarResposta(interaction);

            return;

        }

    }

};