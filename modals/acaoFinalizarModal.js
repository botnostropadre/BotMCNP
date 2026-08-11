const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL DE FINALIZAÇÃO DA AÇÃO
// ======================================================

function criarAcaoFinalizarModal(
    acaoMarcadaId
) {

    const modal =
        new ModalBuilder()

            .setCustomId(
                `acao_finalizar_modal_${acaoMarcadaId}`
            )

            .setTitle(
                "🏁 Finalizar Ação"
            );

    const resultado =
        new TextInputBuilder()

            .setCustomId(
                "resultado"
            )

            .setLabel(
                "Resultado da ação"
            )

            .setPlaceholder(
                "Vitória ou Derrota"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setMinLength(6)

            .setMaxLength(10)

            .setRequired(true);

    const valor =
        new TextInputBuilder()

            .setCustomId(
                "valor"
            )

            .setLabel(
                "Quanto rendeu em dinheiro sujo?"
            )

            .setPlaceholder(
                "Ex.: 1500000"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setMaxLength(30)

            .setRequired(true);

    const observacoes =
        new TextInputBuilder()

            .setCustomId(
                "observacoes"
            )

            .setLabel(
                "Observações"
            )

            .setPlaceholder(
                "Opcional"
            )

            .setStyle(
                TextInputStyle.Paragraph
            )

            .setMaxLength(1000)

            .setRequired(false);

    modal.addComponents(

        new ActionRowBuilder()
            .addComponents(
                resultado
            ),

        new ActionRowBuilder()
            .addComponents(
                valor
            ),

        new ActionRowBuilder()
            .addComponents(
                observacoes
            )

    );

    return modal;

}

module.exports = {
    criarAcaoFinalizarModal
};