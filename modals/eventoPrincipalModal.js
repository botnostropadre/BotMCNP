const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL PRINCIPAL DO EVENTO
// ======================================================

function criarEventoPrincipalModal() {

    const nome = new TextInputBuilder()

        .setCustomId("evento_nome")

        .setLabel("Nome do Evento")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder(
            "Ex.: Encontro da Cosa Nostra"
        )

        .setMaxLength(100)

        .setRequired(true);

    const descricao = new TextInputBuilder()

        .setCustomId("evento_descricao")

        .setLabel("Descrição do Evento")

        .setStyle(TextInputStyle.Paragraph)

        .setPlaceholder(
            "Informe todos os detalhes do evento."
        )

        .setMaxLength(1000)

        .setRequired(true);

    const dataHora = new TextInputBuilder()

        .setCustomId("evento_data_hora")

        .setLabel("Data e Hora")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder(
            "Ex.: 10/08/2026 às 21:00"
        )

        .setMaxLength(100)

        .setRequired(true);

    const traje = new TextInputBuilder()

        .setCustomId("evento_traje")

        .setLabel("Traje")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder(
            "Ex.: Social preto"
        )

        .setMaxLength(100)

        .setRequired(true);

    const responsavel = new TextInputBuilder()

        .setCustomId("evento_responsavel")

        .setLabel("Responsável pelo Evento")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder(
            "Ex.: Bárbara"
        )

        .setMaxLength(100)

        .setRequired(true);

    return new ModalBuilder()

        .setCustomId(
            "evento_modal_principal"
        )

        .setTitle(
            "Criar Evento"
        )

        .addComponents(

            new ActionRowBuilder()
                .addComponents(nome),

            new ActionRowBuilder()
                .addComponents(descricao),

            new ActionRowBuilder()
                .addComponents(dataHora),

            new ActionRowBuilder()
                .addComponents(traje),

            new ActionRowBuilder()
                .addComponents(responsavel)

        );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarEventoPrincipalModal
};