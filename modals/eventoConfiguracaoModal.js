const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL DE CONFIGURAÇÃO DO EVENTO
// ======================================================

function criarEventoConfiguracaoModal() {

    const quantidade = new TextInputBuilder()

        .setCustomId("evento_quantidade")

        .setLabel("Quantidade de Auxiliares")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder("Ex.: 5")

        .setMaxLength(2)

        .setRequired(true);

    const flyer = new TextInputBuilder()

        .setCustomId("evento_flyer")

        .setLabel("Flyer (URL da imagem)")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder("https://...")

        .setMaxLength(500)

        .setRequired(true);

    return new ModalBuilder()

        .setCustomId(
            "evento_modal_configuracao"
        )

        .setTitle(
            "Configuração do Evento"
        )

        .addComponents(

            new ActionRowBuilder()
                .addComponents(quantidade),

            new ActionRowBuilder()
                .addComponents(flyer)

        );

}

module.exports = {
    criarEventoConfiguracaoModal
};