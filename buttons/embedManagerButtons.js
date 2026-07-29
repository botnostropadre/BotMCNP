const {

    ActionRowBuilder,

    ButtonBuilder,

    ButtonStyle

} = require("discord.js");

function criarEmbedManagerButtons() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("embed_novo")

                    .setLabel("➕ Novo Embed")

                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()

                    .setCustomId("embed_modelos")

                    .setLabel("📂 Modelos")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("embed_config")

                    .setLabel("⚙ Configurações")

                    .setStyle(ButtonStyle.Secondary)

            ),

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("embed_editar")

                    .setLabel("✏ Editar")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("embed_excluir")

                    .setLabel("🗑 Excluir")

                    .setStyle(ButtonStyle.Danger)

            )

    ];

}

module.exports = {

    criarEmbedManagerButtons

};