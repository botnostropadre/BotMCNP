const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function criarMenuMembros() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("membros_promover")

                    .setLabel("⬆ Promover")

                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()

                    .setCustomId("membros_rebaixar")

                    .setLabel("⬇ Rebaixar")

                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()

                    .setCustomId("membros_advertir")

                    .setLabel("⚠ Advertir")

                    .setStyle(ButtonStyle.Danger)

            ),

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("membros_ficha")

                    .setLabel("📋 Ficha")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("membros_demitir")

                    .setLabel("🗑 Demitir")

                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()

                    .setCustomId("dashboard")

                    .setLabel("⬅ Voltar")

                    .setStyle(ButtonStyle.Secondary)

            )

    ];

}

module.exports = {

    criarMenuMembros

};