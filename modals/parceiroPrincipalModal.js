const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL PRINCIPAL DO PARCEIRO
// ======================================================

function criarParceiroPrincipalModal() {

    const nomeFaccao =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_nome_faccao"
            )

            .setLabel(
                "Nome da Facção"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: Cosa Bianca"
            )

            .setMaxLength(100)

            .setRequired(true);

    const categoria =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_categoria"
            )

            .setLabel(
                "Produto ou Serviço"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Armas, Munições, Drogas, Contrabando..."
            )

            .setMaxLength(50)

            .setRequired(true);

    return new ModalBuilder()

        .setCustomId(
            "parceiro_modal_principal"
        )

        .setTitle(
            "Registrar Parceiro"
        )

        .addComponents(

            new ActionRowBuilder()
                .addComponents(
                    nomeFaccao
                ),

            new ActionRowBuilder()
                .addComponents(
                    categoria
                )

        );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarParceiroPrincipalModal
};