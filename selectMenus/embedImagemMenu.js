const {
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");

function criarImagemMenu() {

    const menu = new StringSelectMenuBuilder()

        .setCustomId("embed_imagem_menu")

        .setPlaceholder("Escolha o que deseja editar")

        .addOptions(

            {
                label: "🖼 Thumbnail",
                value: "thumbnail"
            },

            {
                label: "🌄 Imagem Principal",
                value: "imagem"
            }

        );

    return [

        new ActionRowBuilder()

            .addComponents(menu)

    ];

}

module.exports = {

    criarImagemMenu

};