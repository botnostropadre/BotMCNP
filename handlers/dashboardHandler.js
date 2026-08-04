const db = require("../database/database");

const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

const {
    criarMenuMembros
} = require("../buttons/membrosButtons");

const {
    obterSaldo
} = require("../services/financeiroService");

const {
    criarFinanceiro
} = require("../embeds/financeiroEmbed");

const {
    criarFinanceiroButtons
} = require("../buttons/financeiroButtons");

// ======================================================
// HANDLER DO DASHBOARD
// ======================================================

async function handleDashboard(interaction) {

    if (!interaction.isButton()) return;

    switch (interaction.customId) {

        // ==================================================
        // GESTÃO DE INTEGRANTES
        // ==================================================

        case "dash_membros": {

            const embed = new EmbedBuilder()

                .setColor(COLORS.VERDE)

                .setTitle(
                    `💵 ${settings.mc.nome}`
                )

                .setDescription(
`# 👥 Gestão de Integrantes

Escolha uma opção abaixo.

➕ Registrar novos integrantes

⬆ Promover cargos

⬇ Rebaixar cargos

⚠ Aplicar advertências

📋 Consultar ficha

🗑 Remover integrantes`
                )

                .setFooter({
                    text:
                        `${settings.mc.nome} • Painel Administrativo`
                });

            await interaction.update({

                embeds: [embed],

                components:
                    criarMenuMembros()

            });

            break;

        }

        // ==================================================
        // DASHBOARD PRINCIPAL
        // ==================================================

        case "dashboard": {

            db.all(

                "SELECT cargo FROM membros",

                async (error, rows) => {

                    if (error) {

                        console.error(
                            "Erro ao consultar integrantes:",
                            error
                        );

                        return;

                    }

                    const integrantes =
                        rows || [];

                    const stats = {

                        total:
                            integrantes.length,

                        prospect:
                            integrantes.filter(
                                integrante =>
                                    integrante.cargo ===
                                    "Treinamento"
                            ).length,

                        membro:
                            integrantes.filter(
                                integrante =>
                                    integrante.cargo ===
                                    "Membro"
                            ).length,

                        diretoria:
                            integrantes.filter(
                                integrante =>
                                    [
                                        "Liderança",
                                        "Gerência",
                                        "Resp. Elite",
                                        "Resp. Eventos",
                                        "Recrutamento"
                                    ].includes(
                                        integrante.cargo
                                    )
                            ).length,

                        advertencias: 0

                    };

                    const {
                        criarDashboard
                    } = require(
                        "../embeds/dashboardEmbed"
                    );

                    const {
                        criarDashboardButtons
                    } = require(
                        "../buttons/dashboardButtons"
                    );

                    await interaction.update({

                        embeds: [
                            criarDashboard(stats)
                        ],

                        components:
                            criarDashboardButtons()

                    });

                }

            );

            break;

        }

        // ==================================================
        // FINANCEIRO
        // ==================================================

        case "dash_financeiro": {

            const saldo =
                await obterSaldo();

            await interaction.update({

                embeds: [
                    criarFinanceiro(saldo)
                ],

                components:
                    criarFinanceiroButtons()

            });

            const {
                salvarPainel
            } = require(
                "../database/painelRepository"
            );

            const resposta =
                await interaction.fetchReply();

            salvarPainel(

                "financeiro",

                interaction.channel.id,

                resposta.id

            );

            break;

        }

    }

}

module.exports = {
    handleDashboard
};