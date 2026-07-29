const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalRodape() {

    const modal = new ModalBuilder()

        .setCustomId("embed_modal_rodape")

        .setTitle("Rodapé do Embed");

    const texto = new TextInputBuilder()

        .setCustomId("texto")

        .setLabel("Texto do Rodapé")

        .setStyle(TextInputStyle.Short)

        .setRequired(true);

    const icone = new TextInputBuilder()

        .setCustomId("icone")

        .setLabel("URL do Ícone (opcional)")

        .setPlaceholder("https://...")

        .setStyle(TextInputStyle.Short)

        .setRequired(false);

    modal.addComponents(

        new ActionRowBuilder().addComponents(texto),

        new ActionRowBuilder().addComponents(icone)

    );

    return modal;

}

module.exports = {

    criarModalRodape

};