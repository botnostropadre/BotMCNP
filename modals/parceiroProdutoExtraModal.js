const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL DO TERCEIRO PRODUTO
// ======================================================

function criarParceiroProdutoExtraModal() {

    const produto3 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_produto3"
            )

            .setLabel(
                "Produto 3 (Opcional)"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: Munição"
            )

            .setMaxLength(100)

            .setRequired(false);

    const valor3 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_valor3"
            )

            .setLabel(
                "Valor do Produto 3"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: R$ 1.500"
            )

            .setMaxLength(100)

            .setRequired(false);

    return new ModalBuilder()

        .setCustomId(
            "parceiro_modal_produto_extra"
        )

        .setTitle(
            "Produto Adicional"
        )

        .addComponents(

            new ActionRowBuilder()
                .addComponents(
                    produto3
                ),

            new ActionRowBuilder()
                .addComponents(
                    valor3
                )

        );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarParceiroProdutoExtraModal
};