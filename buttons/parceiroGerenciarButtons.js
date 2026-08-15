const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// BOTÕES — GERENCIAR PARCEIRO
// ======================================================

function criarParceiroGerenciarButtons(
    parceiroId
) {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `parceiro_editar_${parceiroId}`
                    )

                    .setLabel(
                        "Editar"
                    )

                    .setEmoji(
                        "✏️"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `parceiro_excluir_${parceiroId}`
                    )

                    .setLabel(
                        "Excluir"
                    )

                    .setEmoji(
                        "🗑️"
                    )

                    .setStyle(
                        ButtonStyle.Danger
                    )

            )

    ];

}

// ======================================================
// BOTÕES — CONFIRMAR EXCLUSÃO
// ======================================================

function criarParceiroExcluirButtons(
    parceiroId
) {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `parceiro_excluir_confirmar_${parceiroId}`
                    )

                    .setLabel(
                        "Confirmar exclusão"
                    )

                    .setEmoji(
                        "🗑️"
                    )

                    .setStyle(
                        ButtonStyle.Danger
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `parceiro_excluir_cancelar_${parceiroId}`
                    )

                    .setLabel(
                        "Cancelar"
                    )

                    .setEmoji(
                        "❌"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )

            )

    ];

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarParceiroGerenciarButtons,

    criarParceiroExcluirButtons

};