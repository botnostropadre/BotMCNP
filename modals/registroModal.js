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
        .setMaxLength(50)
        .setRequired(true);

    const idCidade = new TextInputBuilder()
        .setCustomId("idCidade")
        .setLabel("ID")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex.: 1234")
        .setMinLength(1)
        .setMaxLength(20)
        .setRequired(true);

    const recrutador = new TextInputBuilder()
        .setCustomId("recrutador")
        .setLabel("Quem te recrutou?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex.: Salomão")
        .setMinLength(2)
        .setMaxLength(50)
        .setRequired(true);

    const areaDesejada = new TextInputBuilder()
        .setCustomId("areaDesejada")
        .setLabel("Área desejada?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Elite, Eventos ou Farm")
        .setMinLength(4)
        .setMaxLength(20)
        .setRequired(true);

    const live = new TextInputBuilder()
        .setCustomId("live")
        .setLabel("Faz live?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Não | ou cole o link do seu canal")
        .setMaxLength(200)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder()
            .addComponents(nome),

        new ActionRowBuilder()
            .addComponents(idCidade),

        new ActionRowBuilder()
            .addComponents(recrutador),

        new ActionRowBuilder()
            .addComponents(areaDesejada),

        new ActionRowBuilder()
            .addComponents(live)
    );

    return modal;
}

module.exports = {
    criarModalRegistro
};