const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalAutor() {

    const modal = new ModalBuilder()

        .setCustomId("embed_modal_autor")

        .setTitle("Autor do Embed");

    const nome = new TextInputBuilder()

        .setCustomId("nome")

        .setLabel("Nome do Autor")

        .setStyle(TextInputStyle.Short)

        .setRequired(true);

    const icone = new TextInputBuilder()

        .setCustomId("icone")

        .setLabel("URL do Ícone (opcional)")

        .setPlaceholder("https://...")

        .setStyle(TextInputStyle.Short)

        .setRequired(false);

    modal.addComponents(

        new ActionRowBuilder().addComponents(nome),

        new ActionRowBuilder().addComponents(icone)

    );

    return modal;

}

module.exports = {

    criarModalAutor

};