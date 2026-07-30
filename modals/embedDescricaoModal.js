const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL - DESCRIÇÃO
// ======================================================

function criarModalDescricao() {

    const descricao = new TextInputBuilder()

        .setCustomId("descricao")

        .setLabel("Descrição do Embed")

        .setStyle(TextInputStyle.Paragraph)

        .setPlaceholder(
            "Digite aqui o conteúdo completo do embed."
        )

        .setRequired(true)

        .setMaxLength(4000);

    const linhaDescricao =
        new ActionRowBuilder()
            .addComponents(descricao);

    const modal = new ModalBuilder()

        .setCustomId(
            "embed_modal_descricao"
        )

        .setTitle(
            "Editar Descrição"
        )

        .addComponents(
            linhaDescricao
        );

    return modal;

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    criarModalDescricao
};