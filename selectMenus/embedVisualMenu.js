const {
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");

function criarVisualMenu() {

    const menu = new StringSelectMenuBuilder()

        .setCustomId("embed_visual_menu")

        .setPlaceholder("Selecione o que deseja editar")

        .addOptions(

            {

                label: "Cor do Embed",

                description: "Alterar a cor da lateral",

                emoji: "🎨",

                value: "cor"

            },

            {

                label: "Rodapé",

                description: "Editar o texto do rodapé",

                emoji: "📝",

                value: "rodape"

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