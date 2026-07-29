const {
    ChannelSelectMenuBuilder,
    ActionRowBuilder,
    ChannelType
} = require("discord.js");

function criarCanalMenu() {

    const menu = new ChannelSelectMenuBuilder()

        .setCustomId("embed_canal_menu")

        .setPlaceholder("Selecione o canal")

        .addChannelTypes(

            ChannelType.GuildText

        );

    return [

        new ActionRowBuilder()

            .addComponents(menu)

    ];

}

module.exports = {

    criarCanalMenu

};