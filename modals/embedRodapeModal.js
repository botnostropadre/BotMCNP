const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL - RODAPÉ
// ======================================================

function criarModalRodape() {

    const texto = new TextInputBuilder()
        .setCustomId("texto")
        .setLabel("Texto do Rodapé")
        .setPlaceholder("Ex.: Padre Nosso MC")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(2048);

    return new ModalBuilder()
        .setCustomId("embed_modal_rodape")
        .setTitle("Editar Rodapé")
        .addComponents(
            new ActionRowBuilder().addComponents(texto)
        );

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    criarModalRodape
};