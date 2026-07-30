const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const {
    criarModalCor
} = require("../modals/embedCorModal");

const {
    criarModalImagem
} = require("../modals/embedImagemModal");

const {
    criarModalRodape
} = require("../modals/embedRodapeModal");

const {
    atualizarEditor
} = require("../services/embedBuilderService");

// ======================================================
// APAGAR RESPOSTA TEMPORÁRIA
// ======================================================

function apagarResposta(interaction, tempo = 10000) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, tempo);

}

// ======================================================
// HANDLER DE MENUS DE SELEÇÃO
// ======================================================

async function handleSelectMenu(interaction) {

    if (
        !interaction.isStringSelectMenu() &&
        !interaction.isChannelSelectMenu()
    ) {

        return;

    }

    // ==================================================
    // CATEGORIA FINANCEIRA
    // ==================================================

    if (
        interaction.isStringSelectMenu() &&
        interaction.customId.startsWith(
            "categoria_financeira_"
        )
    ) {

        const tipo = interaction.customId.replace(
            "categoria_financeira_",
            ""
        );

        const categoria = interaction.values[0];

        const modal = new ModalBuilder()

            .setCustomId(
                `financeiro_${tipo}_${categoria}`
            )

            .setTitle(
                tipo === "entrada"
                    ? "Registrar Entrada"
                    : "Registrar Saída"
            );

        const valor = new TextInputBuilder()

            .setCustomId("valor")

            .setLabel("Valor")

            .setPlaceholder("Ex.: 1500,00")

            .setStyle(TextInputStyle.Short)

            .setRequired(true);

        const descricao = new TextInputBuilder()

            .setCustomId("descricao")

            .setLabel("Descrição")

            .setStyle(TextInputStyle.Paragraph)

            .setRequired(true);

        modal.addComponents(

            new ActionRowBuilder()
                .addComponents(valor),

            new ActionRowBuilder()
                .addComponents(descricao)

        );

        return interaction.showModal(modal);

    }

    // ==================================================
    // MENU VISUAL DO EMBED
    // ==================================================

    if (
        interaction.isStringSelectMenu() &&
        interaction.customId ===
        "embed_visual_menu"
    ) {

        const opcao = interaction.values[0];

        if (opcao === "cor") {

            return interaction.showModal(
                criarModalCor()
            );

        }

        if (opcao === "rodape") {

            return interaction.showModal(
                criarModalRodape()
            );

        }

        return;

    }

    // ==================================================
    // MENU DE IMAGEM DO EMBED
    // ==================================================

    if (
        interaction.isStringSelectMenu() &&
        interaction.customId ===
        "embed_imagem_menu"
    ) {

        const opcao = interaction.values[0];

        if (opcao === "faixa") {

            return interaction.showModal(
                criarModalImagem()
            );

        }

        return;

    }

    // ==================================================
    // SELEÇÃO DO CANAL DE PUBLICAÇÃO
    // ==================================================

    if (
        interaction.isChannelSelectMenu() &&
        interaction.customId ===
        "embed_canal_menu"
    ) {

        atualizarEditor(
            interaction.user.id,
            {
                canal: interaction.values[0]
            }
        );

        await interaction.reply({

            content:
                "✅ Canal salvo com sucesso.",

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

}

module.exports = {

    handleSelectMenu

};