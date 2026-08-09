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

                        return reject(
                            error
                        );

                    }

                    resolve(this);

                }
            );

        }
    );

}

// ======================================================
// CONSULTAR CONTAGEM
// ======================================================

function contarPendentes() {

    return new Promise(
        (resolve, reject) => {

            db.get(
                `
                    SELECT COUNT(*) AS total
                    FROM registrosPendentes

                    WHERE status IN (
                        'Pendente',
                        'Processando'
                    )
                `,
                [],
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
                        row?.total || 0
                    );

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
            "limparpendentes"
        )

        .setDescription(
            "Remove registros pendentes ou travados do sistema."
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

            const total =
                await contarPendentes();

            if (
                total === 0
            ) {

                await interaction.editReply({

                    content:
                        "✅ Não existem registros pendentes ou travados para limpar."

                });

                return;

            }

            const resultado =
                await executar(
                    `
                        DELETE FROM registrosPendentes

                        WHERE status IN (
                            'Pendente',
                            'Processando'
                        )
                    `
                );

            const embed =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERMELHO
                    )

                    .setTitle(
                        "🧹 Registros pendentes limpos"
                    )

                    .setDescription(
                        "Os registros que estavam aguardando análise ou ficaram travados foram removidos."
                    )

                    .addFields(

                        {
                            name:
                                "🗑️ Registros removidos",

                            value:
                                `${resultado.changes}`,

                            inline:
                                true
                        },

                        {
                            name:
                                "👤 Executado por",

                            value:
                                `${interaction.user}`,

                            inline:
                                true
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

            if (
                canalLogsId
            ) {

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

            await interaction.editReply({

                content:
                    `✅ Limpeza concluída.\n\n` +
                    `🗑️ **${resultado.changes}** registro(s) pendente(s) removido(s).\n\n` +
                    "As pessoas afetadas já podem preencher uma nova ficha."

            });

        } catch (error) {

            console.error(
                "Erro ao limpar registros pendentes:",
                error
            );

            await interaction.editReply({

                content:
                    `❌ Não foi possível limpar os registros pendentes.\n\n` +
                    `Erro: ${error.message}`

            }).catch(() => {});

        }

    }

};