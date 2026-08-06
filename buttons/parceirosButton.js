const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// BOTÃO DO PAINEL DE PARCEIROS
// ======================================================

function criarParceirosButton() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_criar"
                    )

                    .setLabel(
                        "Registrar Parceiro"
                    )

                    .setEmoji("🤝")

                    .setStyle(
                        ButtonStyle.Success
                    )

            )

    ];

}

// ======================================================
// BOTÕES DE CONTINUAÇÃO
// ======================================================

function criarParceiroContinuarButtons() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_continuar_responsaveis"
                    )

                    .setLabel(
                        "Continuar"
                    )

                    .setEmoji("➡️")

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_cancelar"
                    )

                    .setLabel(
                        "Cancelar"
                    )

                    .setEmoji("❌")

                    .setStyle(
                        ButtonStyle.Danger
                    )

            )

    ];

}

// ======================================================
// BOTÕES PARA ETAPA DOS PRODUTOS
// ======================================================

function criarParceiroProdutosButtons() {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_continuar_produto_extra"
                    )

                    .setLabel(
                        "Continuar"
                    )

                    .setEmoji("➡️")

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_cancelar"
                    )

                    .setLabel(
                        "Cancelar"
                    )

                    .setEmoji("❌")

                    .setStyle(
                        ButtonStyle.Danger
                    )

            )

    ];



    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_continuar_produtos"
                    )

                    .setLabel(
                        "Cadastrar Produtos"
                    )

                    .setEmoji("📦")

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        "parceiro_cancelar"
                    )

                    .setLabel(
                        "Cancelar"
                    )

                    .setEmoji("❌")

                    .setStyle(
                        ButtonStyle.Danger
                    )

            )

    ];

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarParceirosButton,

    criarParceiroContinuarButtons,

    criarParceiroProdutosButtons

};