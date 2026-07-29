const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function criarFinanceiroButtons() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("financeiro_entrada")
                    .setLabel("📥 Entrada")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("financeiro_saida")
                    .setLabel("📤 Saída")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("financeiro_historico")
                    .setLabel("📜 Histórico")
                    .setStyle(ButtonStyle.Primary)

            ),

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("dashboard")
                    .setLabel("⬅ Voltar")
                    .setStyle(ButtonStyle.Secondary)

            )

    ];

}

module.exports = {

    criarFinanceiroButtons

};