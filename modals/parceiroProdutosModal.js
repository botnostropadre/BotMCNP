const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL PRINCIPAL DE PRODUTOS
// ======================================================

function criarParceiroProdutosModal() {

    const telefone3 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_telefone3"
            )

            .setLabel(
                "Telefone do Responsável 3"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "000-000"
            )

            .setMaxLength(20)

            .setRequired(false);

    const produto1 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_produto1"
            )

            .setLabel(
                "Produto 1"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: AK-47"
            )

            .setMaxLength(100)

            .setRequired(true);

    const valor1 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_valor1"
            )

            .setLabel(
                "Valor do Produto 1"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: R$ 200.000"
            )

            .setMaxLength(100)

            .setRequired(true);

    const produto2 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_produto2"
            )

            .setLabel(
                "Produto 2 (Opcional)"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: Five Seven"
            )

            .setMaxLength(100)

            .setRequired(false);

    const valor2 =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_valor2"
            )

            .setLabel(
                "Valor do Produto 2"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: R$ 80.000"
            )

            .setMaxLength(100)

            .setRequired(false);

    return new ModalBuilder()

        .setCustomId(
            "parceiro_modal_produtos"
        )

        .setTitle(
            "Produtos e Valores"
        )

        .addComponents(

            new ActionRowBuilder()
                .addComponents(
                    telefone3
                ),

            new ActionRowBuilder()
                .addComponents(
                    produto1
                ),

            new ActionRowBuilder()
                .addComponents(
                    valor1
                ),

            new ActionRowBuilder()
                .addComponents(
                    produto2
                ),

            new ActionRowBuilder()
                .addComponents(
                    valor2
                )

        );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarParceiroProdutosModal
};