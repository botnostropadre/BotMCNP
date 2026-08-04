const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const db = require("../database/database");

const {
    criarDashboard
} = require("../embeds/dashboardEmbed");

const {
    criarDashboardButtons
} = require("../buttons/dashboardButtons");

// ======================================================
// COMANDO /DASHBOARD
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("dashboard")

        .setDescription(
            "Abre o painel administrativo da organização."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageRoles
        ),

    async execute(interaction) {

        db.all(

            "SELECT cargo FROM membros",

            async (error, rows) => {

                if (error) {

                    console.error(
                        "Erro ao carregar o dashboard:",
                        error
                    );

                    return interaction.reply({

                        content:
                            "❌ Erro ao carregar o painel administrativo.",

                        flags:
                            MessageFlags.Ephemeral

                    });

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

                    advertencias:
                        0

                };

                await interaction.reply({

                    embeds: [
                        criarDashboard(stats)
                    ],

                    components:
                        criarDashboardButtons(),

                    flags:
                        MessageFlags.Ephemeral

                });

            }

        );

    }

};