const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL - FAIXA
// ======================================================

function criarModalImagem() {

    const url = new TextInputBuilder()
        .setCustomId("url")
        .setLabel("URL da Faixa")
        .setPlaceholder("https://exemplo.com/imagem.png")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(1024);

    return new ModalBuilder()
        .setCustomId("embed_modal_faixa")
        .setTitle("Editar Faixa")
        .addComponents(
            new ActionRowBuilder().addComponents(url)
        );

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    criarModalImagem
};