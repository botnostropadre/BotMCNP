const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalDescricao() {

    const modal = new ModalBuilder()

        .setCustomId("embed_modal_descricao")

        .setTitle("Descrição do Embed");

    const descricao = new TextInputBuilder()

        .setCustomId("descricao")

        .setLabel("Descrição")

        .setStyle(TextInputStyle.Paragraph)

        .setPlaceholder("Digite a descrição...")

        .setRequired(true)

        .setMaxLength(4000);

    modal.addComponents(

        new ActionRowBuilder()

            .addComponents(descricao)

    );

    return modal;

}

module.exports = {

    criarModalDescricao

};