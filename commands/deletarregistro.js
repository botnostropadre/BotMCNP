const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const db =
    require("../database/database");

const settings =
    require("../config/settings.json");

const COLORS =
    require("../config/colors");

// ======================================================
// EXECUTAR SQL
// ======================================================

function executar(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.run(
                sql,
                parametros,
                function (error) {

                    if (error) {
                        return reject(error);
                    }

                    resolve(this);

                }
            );

        }
    );

}

// ======================================================
// CONSULTAR UMA LINHA
// ======================================================

function consultarUm(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.get(
                sql,
                parametros,
                (error, row) => {

                    if (error) {
                        return reject(error);
                    }

                    resolve(row || null);

                }
            );

        }
    );

}

// ======================================================
// COMANDO
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName(
            "deletarregistro"
        )

        .setDescription(
            "Exclui o registro de um integrante do sistema."
        )

        .addStringOption(option =>

            option

                .setName(
                    "id"
                )

                .setDescription(
                    "ID do Discord da pessoa."
                )

                .setRequired(true)

        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        await interaction.deferReply({
            flags:
                MessageFlags.Ephemeral
        });

        try {

            // ==========================================
            // PEGAR ID
            // ==========================================

            const discordId =
                interaction.options
                    .getString(
                        "id",
                        true
                    )
                    .trim();

            // ==========================================
            // VALIDAR ID
            // ==========================================

            if (
                !/^\d{17,20}$/.test(
                    discordId
                )
            ) {

                await interaction.editReply({

                    content:
                        "❌ Informe um ID válido do Discord."

                });

                return;

            }

            // ==========================================
            // PROCURAR REGISTRO
            // ==========================================

            const membro =
                await consultarUm(
                    `
                        SELECT *
                        FROM membros
                        WHERE discordId = ?
                    `,
                    [
                        discordId
                    ]
                );

            if (!membro) {

                await interaction.editReply({

                    content:
                        "❌ Não existe nenhum integrante registrado com esse ID."

                });

                return;

            }

            // ==========================================
            // EXCLUIR REGISTRO
            // ==========================================

            await executar(
                `
                    DELETE FROM membros
                    WHERE discordId = ?
                `,
                [
                    discordId
                ]
            );

            // ==========================================
            // LIMPAR SOLICITAÇÕES DE REGISTRO
            // ==========================================

            await executar(
                `
                    DELETE FROM registrosPendentes
                    WHERE discordId = ?
                `,
                [
                    discordId
                ]
            );

            // ==========================================
            // EMBED DE CONFIRMAÇÃO
            // ==========================================

            const embed =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERMELHO
                    )

                    .setTitle(
                        "🗑️ Registro excluído"
                    )

                    .setDescription(
                        "O integrante foi removido do sistema de registro."
                    )

                    .addFields(

                        {
                            name:
                                "👤 Integrante",

                            value:
                                membro.nome ||
                                "Não informado",

                            inline:
                                true
                        },

                        {
                            name:
                                "🆔 ID Cidade",

                            value:
                                membro.idCidade ||
                                "Não informado",

                            inline:
                                true
                        },

                        {
                            name:
                                "💬 Discord ID",

                            value:
                                discordId,

                            inline:
                                false
                        },

                        {
                            name:
                                "🗑️ Excluído por",

                            value:
                                `${interaction.user}`,

                            inline:
                                false
                        }

                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Sistema de Registro`

                    })

                    .setTimestamp();

            // ==========================================
            // LOG
            // ==========================================

            const canalLogsId =
                settings.canais?.logs;

            if (canalLogsId) {

                const canalLogs =
                    interaction.guild.channels.cache.get(
                        canalLogsId
                    ) ||
                    await interaction.guild.channels
                        .fetch(
                            canalLogsId
                        )
                        .catch(() => null);

                if (
                    canalLogs &&
                    canalLogs.isTextBased()
                ) {

                    await canalLogs.send({
                        embeds: [
                            embed
                        ]
                    });

                }

            }

            // ==========================================
            // CONFIRMAÇÃO
            // ==========================================

            await interaction.editReply({

                content:
                    `✅ O registro de <@${discordId}> foi excluído.\n\n` +
                    "A pessoa já pode preencher uma nova ficha de registro."

            });

        } catch (error) {

            console.error(
                "Erro ao deletar registro:",
                error
            );

            await interaction.editReply({

                content:
                    "❌ Não foi possível excluir o registro.\n\n" +
                    `Erro: ${error.message}`

            }).catch(() => {});

        }

    }

};