const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const db = require("../database/database");
const { criarHistorico } = require("../embeds/historicoEmbed");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("historico")

        .setDescription("Mostra o histórico financeiro.")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageRoles
        ),

    async execute(interaction) {

        db.all(

            `SELECT *
             FROM historicoFinanceiro
             ORDER BY id DESC
             LIMIT 10`,

            async (err, rows) => {

                if (err) {

                    console.error(err);

                    return interaction.reply({

                        content: "❌ Erro ao carregar histórico.",

                        ephemeral: true

                    });

                }

                await interaction.reply({

                    embeds: [

                        criarHistorico(rows)

                    ],

                    ephemeral: true

                });

            }

        );

    }

};