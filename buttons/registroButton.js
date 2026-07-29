const { ButtonBuilder, ButtonStyle } = require("discord.js");

function criarBotaoRegistro() {
    return new ButtonBuilder()
        .setCustomId("registro")
        .setLabel("📋 Fazer Registro")
        .setStyle(ButtonStyle.Primary);
}

module.exports = { criarBotaoRegistro };