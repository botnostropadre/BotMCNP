const {
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");

function criarImagemMenu() {

    const menu = new StringSelectMenuBuilder()

        .setCustomId("embed_imagem_menu")

        .setPlaceholder("Selecione a imagem do embed")

        .addOptions(

            {

                label: "🖼 Faixa Inferior",

                description: "Imagem exibida na parte inferior do embed",

                value: "faixa"

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