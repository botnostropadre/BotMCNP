const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalCor() {

    const modal = new ModalBuilder()

        .setCustomId("embed_modal_cor")

        .setTitle("Cor do Embed");

    const cor = new TextInputBuilder()

        .setCustomId("cor")

        .setLabel("Cor em HEX")

        .setPlaceholder("#2ECC71")

        .setStyle(TextInputStyle.Short)

        .setRequired(true);

    modal.addComponents(

        new ActionRowBuilder()

            .addComponents(cor)

    );

    return modal;

}

module.exports = {

    criarModalCor

};