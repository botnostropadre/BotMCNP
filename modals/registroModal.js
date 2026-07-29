const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

function criarModalRegistro() {

    const modal = new ModalBuilder()
        .setCustomId("registroModal")
        .setTitle("📋 Registro de Integrante");

    const nome = new TextInputBuilder()
        .setCustomId("nome")
        .setLabel("Nome")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex.: Salomão")
        .setMinLength(2)
        .setMaxLength(20)
        .setRequired(true);

    const vulgo = new TextInputBuilder()
        .setCustomId("vulgo")
        .setLabel("Vulgo")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex.: Cicatriz")
        .setMinLength(2)
        .setMaxLength(20)
        .setRequired(true);

    const sobrenome = new TextInputBuilder()
        .setCustomId("sobrenome")
        .setLabel("Sobrenome")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex.: Nox")
        .setMinLength(2)
        .setMaxLength(20)
        .setRequired(true);

    const secretario = new TextInputBuilder()
        .setCustomId("secretario")
        .setLabel("Secretário responsável")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex.: Salomão Nox")
        .setMinLength(2)
        .setMaxLength(50)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder().addComponents(nome),
        new ActionRowBuilder().addComponents(vulgo),
        new ActionRowBuilder().addComponents(sobrenome),
        new ActionRowBuilder().addComponents(secretario)
    );

    return modal;

}

module.exports = {
    criarModalRegistro
};