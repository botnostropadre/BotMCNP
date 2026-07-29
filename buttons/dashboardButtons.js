const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function criarDashboardButtons() {

    return [

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("dash_membros")
                    .setLabel("👤 Membros")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("dash_promocoes")
                    .setLabel("⬆ Promoções")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("dash_advertencias")
                    .setLabel("⚠ Advertências")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("dash_estatisticas")
                    .setLabel("📊 Estatísticas")
                    .setStyle(ButtonStyle.Secondary)

            ),

        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId("dash_financeiro")
                    .setLabel("💰 Financeiro")
                    .setStyle(ButtonStyle.Success)

            )

    ];

}

module.exports = {

    criarDashboardButtons

};