const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL DE REGISTRO DE FARM
// ======================================================

function criarFarmModal() {

    const dados = new TextInputBuilder()

        .setCustomId("farm_tijolos")

        .setLabel("💳 Quantidade de Dados")

        .setPlaceholder("Ex.: 350")

        .setStyle(TextInputStyle.Short)

        .setRequired(false)

        .setMaxLength(10);

    const dinheiroSujo = new TextInputBuilder()

        .setCustomId("farm_materiais")

        .setLabel("💵 Dinheiro Sujo")

        .setPlaceholder("Ex.: 100000")

        .setStyle(TextInputStyle.Short)

        .setRequired(false)

        .setMaxLength(15);

    return new ModalBuilder()

        .setCustomId("farm_modal_registro")

        .setTitle("Registrar Farm")

        .addComponents(

            new ActionRowBuilder()
                .addComponents(dados),

            new ActionRowBuilder()
                .addComponents(dinheiroSujo)

        );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarFarmModal
};