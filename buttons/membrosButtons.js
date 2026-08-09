const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// MENU DE GESTÃO DE INTEGRANTES
// ======================================================

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

                    .setLabel("📋 Perfil")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("membros_demitir")

                    .setLabel("🚪 Desligar")

                    .setStyle(ButtonStyle.Danger)

            )

    ];

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarMenuMembros

};