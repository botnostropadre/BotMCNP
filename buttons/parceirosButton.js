const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// BOTÃO DO PAINEL DE PARCEIROS
// ======================================================

function criarParceirosButton() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_criar"
                    )

                    .setLabel(
                        "Registrar Parceiro"
                    )

                    .setEmoji(
                        "🤝"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    )

            )

    ];

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarParceirosButton
};