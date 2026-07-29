const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalCampo() {

    const modal = new ModalBuilder()

        .setCustomId("embed_modal_campo")

        .setTitle("Adicionar Campo");

    const nome = new TextInputBuilder()

        .setCustomId("nome")

        .setLabel("Título do Campo")

        .setStyle(TextInputStyle.Short)

        .setRequired(true);

    const valor = new TextInputBuilder()

        .setCustomId("valor")

        .setLabel("Conteúdo")

        .setStyle(TextInputStyle.Paragraph)

        .setRequired(true);

    const inline = new TextInputBuilder()

        .setCustomId("inline")

        .setLabel("Inline? (sim/não)")

        .setPlaceholder("sim")

        .setStyle(TextInputStyle.Short)

        .setRequired(false);

    modal.addComponents(

        new ActionRowBuilder().addComponents(nome),

        new ActionRowBuilder().addComponents(valor),

        new ActionRowBuilder().addComponents(inline)

    );

    return modal;

}

module.exports = {

    criarModalCampo

};