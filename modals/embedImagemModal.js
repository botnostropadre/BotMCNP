const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalImagem(tipo) {

    const modal = new ModalBuilder()

        .setCustomId(`embed_modal_${tipo}`)

        .setTitle(

            tipo === "thumbnail"

                ? "Thumbnail"

                : "Imagem Principal"

        );

    const url = new TextInputBuilder()

        .setCustomId("url")

        .setLabel("URL da imagem")

        .setPlaceholder("https://...")

        .setStyle(TextInputStyle.Short)

        .setRequired(true);

    modal.addComponents(

        new ActionRowBuilder()

            .addComponents(url)

    );

    return modal;

}

module.exports = {

    criarModalImagem

};