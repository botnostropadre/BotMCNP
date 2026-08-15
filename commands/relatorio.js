const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const COLORS =
    require("../config/colors");

const {
    obterRelatorioSemanal,
    META_DADOS_SEMANAL,
    META_DINHEIRO_SUJO_SEMANAL
} = require("../services/farmService");

// ======================================================
// FORMATAR NÚMERO
// ======================================================

function formatarNumero(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR"
    );

}

// ======================================================
// FORMATAR DINHEIRO
// ======================================================

function formatarDinheiro(valor) {

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
// POSIÇÃO DO RANKING
// ======================================================

function obterMedalha(indice) {

    if (
        indice === 0
    ) {

        return "🥇";

    }

    if (
        indice === 1
    ) {

        return "🥈";

    }

    if (
        indice === 2
    ) {

        return "🥉";

    }

    return (
        `**${indice + 1}º**`
    );

}

// ======================================================
// COMANDO /RELATORIO
// ======================================================

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                "relatorio"
            )

            .setDescription(
                "Mostra o relatório semanal de farm."
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

    async execute(
        interaction
    ) {

        try {

            await interaction.deferReply({
                flags:
                    64
            });

            const registros =
                await obterRelatorioSemanal();

            // ==================================================
            // SEM REGISTROS
            // ==================================================

            if (
                !Array.isArray(
                    registros
                ) ||
                registros.length === 0
            ) {

                await interaction.editReply({

                    content:
                        "⚠️ Nenhum farm foi registrado nesta semana."

                });

                setTimeout(
                    async () => {

                        try {

                            await interaction
                                .deleteReply();

                        } catch {}

                    },
                    10000
                );

                return;

            }

            // ==================================================
            // TOTAIS GERAIS
            // ==================================================

            let totalDados =
                0;

            let totalDinheiroSujo =
                0;

            // ==================================================
            // RANKING
            // ==================================================

            const linhasRanking =
                registros.map(
                    (
                        registro,
                        indice
                    ) => {

                        const dados =
                            Number(
                                registro.dados ||
                                0
                            );

                        const dinheiroSujo =
                            Number(
                                registro.dinheiroSujo ||
                                0
                            );

                        totalDados +=
                            dados;

                        totalDinheiroSujo +=
                            dinheiroSujo;

                        const nome =
                            registro.nomeExibicao ||
                            `Usuário ${registro.discordId}`;

                        // ==========================================
                        // PROGRESSO DOS DADOS
                        // ==========================================

                        const progressoDados =
                            dados >=
                            META_DADOS_SEMANAL

                                ? "✅ Meta semanal de Dados atingida"

                                : `⏳ Faltam ${formatarNumero(
                                    META_DADOS_SEMANAL -
                                    dados
                                )} Dados`;

                        // ==========================================
                        // PROGRESSO DO DINHEIRO SUJO
                        // ==========================================

                        const progressoDinheiroSujo =
                            dinheiroSujo >=
                            META_DINHEIRO_SUJO_SEMANAL

                                ? "✅ Meta de Dinheiro Sujo atingida"

                                : `⏳ Faltam ${formatarDinheiro(
                                    META_DINHEIRO_SUJO_SEMANAL -
                                    dinheiroSujo
                                )}`;

                        return (
                            `${obterMedalha(indice)} **${nome}**\n` +

                            `💳 Dados: **${formatarNumero(
                                dados
                            )} / ${formatarNumero(
                                META_DADOS_SEMANAL
                            )}**\n` +

                            `   ${progressoDados}\n` +

                            `💵 Dinheiro Sujo: **${formatarDinheiro(
                                dinheiroSujo
                            )} / ${formatarDinheiro(
                                META_DINHEIRO_SUJO_SEMANAL
                            )}**\n` +

                            `   ${progressoDinheiroSujo}`
                        );

                    }
                );

            const descricaoRanking =
                linhasRanking.join(
                    "\n\n━━━━━━━━━━━━━━━━━━━━\n\n"
                );

            // ==================================================
            // EMBED
            // ==================================================

            const embed =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERDE
                    )

                    .setTitle(
                        "🏆 Relatório Semanal de Farm"
                    )

                    .setDescription(
`${descricaoRanking}

━━━━━━━━━━━━━━━━━━━━

📊 **Total arrecadado pela Cosa Nostra**

💳 Dados: **${formatarNumero(
    totalDados
)} unidades**

💵 Dinheiro Sujo: **${formatarDinheiro(
    totalDinheiroSujo
)}**`
                    )

                    .setFooter({

                        text:
                            "Cosa Nostra • Relatório semanal"

                    })

                    .setTimestamp();

            // ==================================================
            // ENVIAR
            // ==================================================

            await interaction.editReply({

                embeds: [
                    embed
                ]

            });

            setTimeout(
                async () => {

                    try {

                        await interaction
                            .deleteReply();

                    } catch {}

                },
                60000
            );

        } catch (error) {

            console.error(
                "Erro ao gerar relatório de farm:",
                error
            );

            const mensagem =
                "❌ Não foi possível gerar o relatório semanal.";

            if (
                interaction.deferred ||
                interaction.replied
            ) {

                await interaction.editReply({

                    content:
                        mensagem,

                    embeds:
                        []

                }).catch(
                    () => {}
                );

            } else {

                await interaction.reply({

                    content:
                        mensagem,

                    flags:
                        64

                }).catch(
                    () => {}
                );

            }

            setTimeout(
                async () => {

                    try {

                        await interaction
                            .deleteReply();

                    } catch {}

                },
                10000
            );

        }

    }

};