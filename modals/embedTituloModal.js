const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalTitulo() {

    const modal = new ModalBuilder()

        .setCustomId("embed_modal_titulo")

        .setTitle("Editar Título");

    const titulo = new TextInputBuilder()

        .setCustomId("titulo")

        .setLabel("Título do Embed")

        .setPlaceholder("Ex: Recrutamento Padre Nostro MC")

        .setStyle(TextInputStyle.Short)

        .setRequired(true)

        .setMaxLength(256);

    modal.addComponents(

        new ActionRowBuilder().addComponents(titulo)

    );

    return modal;

}

module.exports = {

    criarModalTitulo

};