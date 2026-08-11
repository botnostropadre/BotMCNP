const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL — KILLS DO PARTICIPANTE
// ======================================================

function criarAcaoKillsModal({
    acaoMarcadaId,
    discordId,
    nome
}) {

    const modal =
        new ModalBuilder()

            .setCustomId(
                `acao_kills_modal_${acaoMarcadaId}_${discordId}`
            )

            .setTitle(
                "💀 Registrar Kills"
            );

    const kills =
        new TextInputBuilder()

            .setCustomId(
                "kills"
            )

            .setLabel(
                `Kills de ${nome}`.slice(
                    0,
                    45
                )
            )

            .setPlaceholder(
                "Ex.: 3"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setMinLength(1)

            .setMaxLength(3)

            .setRequired(true);

    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(
                kills
            )

    );

    return modal;

}

module.exports = {
    criarAcaoKillsModal
};