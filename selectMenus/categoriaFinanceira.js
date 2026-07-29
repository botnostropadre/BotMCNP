const {
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");

function criarCategoriaFinanceira(tipo) {

    const menu = new StringSelectMenuBuilder()

        .setCustomId(`categoria_financeira_${tipo}`)

        .setPlaceholder("Selecione a categoria")

        .addOptions(

            {
                label: "🧱 Venda de Tijolos",
                value: "Tijolos"
            },

            {
                label: "💊 Venda de Parangas",
                value: "Parangas"
            },

            {
                label: "🌱 Venda de Sementes",
                value: "Sementes"
            },

            {
                label: "💰 Caixa Geral",
                value: "Caixa Geral"
            }

        );

    return [

        new ActionRowBuilder()

            .addComponents(menu)

    ];

}

module.exports = {

    criarCategoriaFinanceira

};