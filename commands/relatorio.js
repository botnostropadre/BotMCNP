const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");

const {
    obterRelatorioSemanal,
    META_TIJOLOS_SEMANAL
} = require("../services/farmService");

// ======================================================
// FORMATAR NÚMERO
// ======================================================

function formatarNumero(valor) {

    return Number(valor || 0)
        .toLocaleString("pt-BR");

}

// ======================================================
// POSIÇÃO DO RANKING
// ======================================================

function obterMedalha(indice) {

    if (indice === 0) return "🥇";
    if (indice === 1) return "🥈";
    if (indice === 2) return "🥉";

    return `**${indice + 1}º**`;

}

// ======================================================
// COMANDO /RELATORIO
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("relatorio")

        .setDescription(
            "Mostra o relatório semanal de farm."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            await interaction.deferReply({
                flags: 64
            });

            const registros =
                await obterRelatorioSemanal();

            if (
                !Array.isArray(registros) ||
                registros.length === 0
            ) {

                await interaction.editReply({
                    content:
                        "⚠️ Nenhum farm foi registrado nesta semana."
                });

                setTimeout(async () => {

                    try {

                        await interaction.deleteReply();

                    } catch {}

                }, 10000);

                return;

            }

            let totalTijolos = 0;
            let totalMateriais = 0;

            const linhasRanking =
                registros.map(
                    (registro, indice) => {

                        const tijolos =
                            Number(
                                registro.tijolos || 0
                            );

                        const materiais =
                            Number(
                                registro.materiais || 0
                            );

                        totalTijolos += tijolos;
                        totalMateriais += materiais;

                        const nome =
                            registro.nomeExibicao ||
                            `Usuário ${registro.discordId}`;

                        const progressoTijolos =
                            tijolos >=
                            META_TIJOLOS_SEMANAL
                                ? "✅ Meta atingida"
                                : `⏳ Faltam ${
                                    META_TIJOLOS_SEMANAL -
                                    tijolos
                                }`;

                        return (
                            `${obterMedalha(indice)} **${nome}**\n` +
                            `🧱 Tijolos: **${formatarNumero(tijolos)} / ${META_TIJOLOS_SEMANAL}**\n` +
                            `   ${progressoTijolos}\n` +
                            `🔩 Materiais: **${formatarNumero(materiais)}**`
                        );

                    }
                );

            const descricaoRanking =
                linhasRanking.join(
                    "\n\n━━━━━━━━━━━━━━━━━━━━\n\n"
                );

            const embed = new EmbedBuilder()

                .setColor(COLORS.VERDE)

                .setTitle(
                    "🏆 Relatório Semanal de Farm"
                )

                .setDescription(
`${descricaoRanking}

━━━━━━━━━━━━━━━━━━━━

📊 **Total arrecadado pelo MC**

🧱 Tijolos: **${formatarNumero(totalTijolos)}**

🔩 Materiais: **${formatarNumero(totalMateriais)}**`
                )

                .setFooter({
                    text:
                        "Padre Nosso MC • Relatório semanal"
                })

                .setTimestamp();

            await interaction.editReply({
                embeds: [embed]
            });

            setTimeout(async () => {

                try {

                    await interaction.deleteReply();

                } catch {}

            }, 60000);

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
                    content: mensagem,
                    embeds: []
                }).catch(() => {});

            } else {

                await interaction.reply({
                    content: mensagem,
                    flags: 64
                }).catch(() => {});

            }

            setTimeout(async () => {

                try {

                    await interaction.deleteReply();

                } catch {}

            }, 10000);

        }

    }

};