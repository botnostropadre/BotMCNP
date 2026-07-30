const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL - COR
// ======================================================

function criarModalCor() {

    const cor = new TextInputBuilder()
        .setCustomId("cor")
        .setLabel("Cor do Embed (HEX)")
        .setPlaceholder("#57F287 ou 57F287")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(7);

    return new ModalBuilder()
        .setCustomId("embed_modal_cor")
        .setTitle("Editar Cor")
        .addComponents(
            new ActionRowBuilder().addComponents(cor)
        );

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    criarModalCor
};