const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL - TÍTULO
// ======================================================

function criarModalTitulo() {

    const titulo = new TextInputBuilder()
        .setCustomId("titulo")
        .setLabel("Título do Embed")
        .setPlaceholder("Ex.: Recrutamento Padre Nosso MC")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(256);

    return new ModalBuilder()
        .setCustomId("embed_modal_titulo")
        .setTitle("Editar Título")
        .addComponents(
            new ActionRowBuilder().addComponents(titulo)
        );

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    criarModalTitulo
};