const {
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");

function criarVisualMenu() {

    const menu = new StringSelectMenuBuilder()

        .setCustomId("embed_visual_menu")

        .setPlaceholder("Escolha uma opção")

        .addOptions(

            {

                label: "Cor do Embed",

                description: "Alterar a cor",

                emoji: "🎨",

                value: "cor"

            },

            {

                label: "Autor",

                description: "Editar autor",

                emoji: "👤",

                value: "autor"

            },

            {

                label: "Rodapé",

                description: "Editar rodapé",

                emoji: "👣",

                value: "rodape"

            },

            {

                label: "Timestamp",

                description: "Ativar ou remover",

                emoji: "📅",

                value: "timestamp"

            }

        );

    return [

        new ActionRowBuilder()

            .addComponents(menu)

    ];

}

module.exports = {

    criarVisualMenu

};