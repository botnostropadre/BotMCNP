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

    const tijolos = new TextInputBuilder()

        .setCustomId("farm_tijolos")

        .setLabel("Quantidade de Tijolos")

        .setPlaceholder("Ex.: 30")

        .setStyle(TextInputStyle.Short)

        .setRequired(false)

        .setMaxLength(10);

    const materiais = new TextInputBuilder()

        .setCustomId("farm_materiais")

        .setLabel("Quantidade de Materiais")

        .setPlaceholder("Ex.: 250")

        .setStyle(TextInputStyle.Short)

        .setRequired(false)

        .setMaxLength(10);

    return new ModalBuilder()

        .setCustomId("farm_modal_registro")

        .setTitle("Registrar Farm")

        .addComponents(

            new ActionRowBuilder()
                .addComponents(tijolos),

            new ActionRowBuilder()
                .addComponents(materiais)

        );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarFarmModal
};