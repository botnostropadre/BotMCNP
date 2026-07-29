const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const { criarModalCor } = require("../modals/embedCorModal");
const { criarModalImagem } = require("../modals/embedImagemModal");
const { criarModalAutor } = require("../modals/embedAutorModal");
const { criarModalRodape } = require("../modals/embedRodapeModal");

const {
    atualizarEditor
} = require("../services/embedBuilderService");

async function handleSelectMenu(interaction) {

    if (!interaction.isStringSelectMenu()) return;

    // ==========================
    // CATEGORIA FINANCEIRA
    // ==========================

    if (interaction.customId.startsWith("categoria_financeira_")) {

        const tipo = interaction.customId.replace(
            "categoria_financeira_",
            ""
        );

        const categoria = interaction.values[0];

        const modal = new ModalBuilder()

            .setCustomId(`financeiro_${tipo}_${categoria}`)

            .setTitle(
                tipo === "entrada"
                    ? "Registrar Entrada"
                    : "Registrar Saída"
            );

        const valor = new TextInputBuilder()

            .setCustomId("valor")

            .setLabel("Valor")

            .setStyle(TextInputStyle.Short)

            .setRequired(true);

        const descricao = new TextInputBuilder()

            .setCustomId("descricao")

            .setLabel("Descrição")

            .setStyle(TextInputStyle.Paragraph)

            .setRequired(true);

        modal.addComponents(

            new ActionRowBuilder().addComponents(valor),

            new ActionRowBuilder().addComponents(descricao)

        );

        return interaction.showModal(modal);

    }

    // ==========================
    // MENU VISUAL
    // ==========================

    if (interaction.customId === "embed_visual_menu") {

        const opcao = interaction.values[0];

        switch (opcao) {

            case "cor":
                return interaction.showModal(
                    criarModalCor()
                );

            case "autor":
                return interaction.showModal(
                    criarModalAutor()
                );

            case "rodape":
                return interaction.showModal(
                    criarModalRodape()
                );

            case "timestamp":

                await interaction.reply({

                    content: "🚧 Editor de Timestamp em desenvolvimento.",

                    flags: 64

                });

                setTimeout(async () => {

                    try {

                        await interaction.deleteReply();

                    } catch {}

                }, 10000);

                return;

        }

    }

    // ==========================
    // MENU IMAGENS
    // ==========================

    if (interaction.customId === "embed_imagem_menu") {

        const opcao = interaction.values[0];

        switch (opcao) {

            case "thumbnail":

                return interaction.showModal(

                    criarModalImagem("thumbnail")

                );

            case "imagem":

                return interaction.showModal(

                    criarModalImagem("imagem")

                );

        }

    }

    // ==========================
    // SELEÇÃO DE CANAL
    // ==========================

    if (interaction.customId === "embed_canal_menu") {

        atualizarEditor(

            interaction.user.id,

            {

                canal: interaction.values[0]

            }

        );

        await interaction.reply({

            content: "✅ Canal salvo com sucesso.",

            flags: 64

        });

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

        return;

    }

}

module.exports = {

    handleSelectMenu

};