const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarEntradaModal(categoria) {

    const modal = new ModalBuilder()

        .setCustomId(`financeiro_entrada_${categoria}`)

        .setTitle("📥 Nova Entrada");

    const valor = new TextInputBuilder()

        .setCustomId("valor")

        .setLabel("Valor")

        .setPlaceholder("Ex: 250000")

        .setStyle(TextInputStyle.Short)

        .setRequired(true);

    const descricao = new TextInputBuilder()

        .setCustomId("descricao")

        .setLabel("Descrição")

        .setPlaceholder("Venda de Maconha")

        .setStyle(TextInputStyle.Short)

        .setRequired(true);

    modal.addComponents(

        new ActionRowBuilder().addComponents(valor),

        new ActionRowBuilder().addComponents(descricao)

    );

    return modal;

}

module.exports = {

    criarEntradaModal

};