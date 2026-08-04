const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const {
    buscarMembro
} = require("../database/membroRepository");

const {
    criarFicha
} = require("../embeds/fichaEmbed");

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
// COMANDO /FICHA
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("ficha")

        .setDescription(
            "Exibe o perfil de um integrante."
        )

        .addUserOption(option =>

            option

                .setName("membro")

                .setDescription(
                    "Selecione o integrante que deseja consultar."
                )

                .setRequired(false)

        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageRoles
        ),

    async execute(interaction) {

        const usuario =
            interaction.options.getUser(
                "membro"
            ) ||
            interaction.user;

        try {

            const membro =
                await buscarMembro(
                    usuario.id
                );

            if (!membro) {

                await interaction.reply({

                    content:
                        "❌ Este usuário não possui registro no sistema.",

                    flags:
                        MessageFlags.Ephemeral

                });

                apagarResposta(interaction);

                return;

            }

            const advertencias =
                Number(
                    membro.advertencias || 0
                );

            const embed =
                criarFicha(
                    usuario,
                    membro,
                    advertencias
                );

            await interaction.reply({

                embeds: [embed],

                flags:
                    MessageFlags.Ephemeral

            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao consultar perfil do integrante:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({

                    content:
                        "❌ Não foi possível consultar o perfil deste integrante.",

                    flags:
                        MessageFlags.Ephemeral

                });

            }

            apagarResposta(interaction);

        }

    }

};