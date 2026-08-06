const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// BOTÕES DE PARTICIPAÇÃO DO EVENTO
// ======================================================

function criarEventoParticipacaoButtons() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "evento_participar"
                    )

                    .setLabel(
                        "Participar da Equipe"
                    )

                    .setEmoji("🙋")

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        "evento_sair"
                    )

                    .setLabel(
                        "Sair da Equipe"
                    )

                    .setEmoji("🚪")

                    .setStyle(
                        ButtonStyle.Danger
                    )

            )

    ];

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarEventoParticipacaoButtons
};