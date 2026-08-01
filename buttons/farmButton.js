const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// BOTÃO DE REGISTRO DE FARM
// ======================================================

function criarFarmButton() {

    const botao = new ButtonBuilder()

        .setCustomId("farm_registrar")

        .setLabel("Registrar Farm")

        .setEmoji("📦")

        .setStyle(ButtonStyle.Success);

    return [

        new ActionRowBuilder()

            .addComponents(botao)

    ];

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarFarmButton
};