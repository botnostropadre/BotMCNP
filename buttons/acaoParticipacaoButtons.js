const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// BOTÕES DE PARTICIPAÇÃO
// ======================================================

function criarAcaoParticipacaoButtons(
    acaoMarcadaId
) {

    return [

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `acao_participar_${acaoMarcadaId}`
                    )

                    .setLabel(
                        "Confirmar Presença"
                    )

                    .setEmoji(
                        "✅"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `acao_sair_${acaoMarcadaId}`
                    )

                    .setLabel(
                        "Sair da Ação"
                    )

                    .setEmoji(
                        "❌"
                    )

                    .setStyle(
                        ButtonStyle.Danger
                    )

            ),

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `acao_finalizar_${acaoMarcadaId}`
                    )

                    .setLabel(
                        "Finalizar Ação"
                    )

                    .setEmoji(
                        "🏁"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    )

            )

    ];

}

module.exports = {
    criarAcaoParticipacaoButtons
};