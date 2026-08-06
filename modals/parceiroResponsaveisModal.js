const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL DOS RESPONSÁVEIS
// ======================================================

function criarParceiroResponsaveisModal() {

    const responsavel1 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_responsavel1"
            )

            .setLabel(
                "Responsável 1"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Nome do responsável"
            )

            .setMaxLength(100)

            .setRequired(true);

    const telefone1 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_telefone1"
            )

            .setLabel(
                "Telefone 1"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "000-000"
            )

            .setMaxLength(20)

            .setRequired(true);

    const responsavel2 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_responsavel2"
            )

            .setLabel(
                "Responsável 2 (Opcional)"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false);

    const telefone2 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_telefone2"
            )

            .setLabel(
                "Telefone 2"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false);

    const responsavel3 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_responsavel3"
            )

            .setLabel(
                "Responsável 3 (Opcional)"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setRequired(false);

    return new ModalBuilder()

        .setCustomId(
            "parceiro_modal_responsaveis"
        )

        .setTitle(
            "Responsáveis"
        )

        .addComponents(

            new ActionRowBuilder()
                .addComponents(
                    responsavel1
                ),

            new ActionRowBuilder()
                .addComponents(
                    telefone1
                ),

            new ActionRowBuilder()
                .addComponents(
                    responsavel2
                ),

            new ActionRowBuilder()
                .addComponents(
                    telefone2
                ),

            new ActionRowBuilder()
                .addComponents(
                    responsavel3
                )

        );

}

module.exports = {
    criarParceiroResponsaveisModal
};