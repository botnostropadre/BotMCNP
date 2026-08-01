const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");

const {
    criarCategoriaFinanceira
} = require("../selectMenus/categoriaFinanceira");

const {
    criarModalRegistro
} = require("../modals/registroModal");

const {
    criarFarmModal
} = require("../modals/farmModal");

const {
    criarEditorButtons
} = require("../buttons/embedEditorButtons");

const {
    criarModalTitulo
} = require("../modals/embedTituloModal");

const {
    criarModalDescricao
} = require("../modals/embedDescricaoModal");

const {
    criarVisualMenu
} = require("../selectMenus/embedVisualMenu");

const {
    criarImagemMenu
} = require("../selectMenus/embedImagemMenu");

const {
    criarModalCampo
} = require("../modals/embedCampoModal");

const {
    criarEditor,
    removerEditor
} = require("../services/embedBuilderService");

const {
    gerarPreviewCompleto
} = require("../services/embedPreviewService");

const {
    gerarStatusEditor
} = require("../services/embedStatusService");

const {
    criarCanalMenu
} = require("../selectMenus/embedCanalMenu");

const {
    publicarEmbed
} = require("../services/publicarEmbedService");

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
// HANDLER DE BOTÕES
// ======================================================

async function handleButton(interaction) {

    if (!interaction.isButton()) return;

    // ==================================================
    // REGISTRAR FARM
    // ==================================================

    if (interaction.customId === "farm_registrar") {

        return interaction.showModal(
            criarFarmModal()
        );

    }

    // ==================================================
    // REGISTRO
    // ==================================================

    if (interaction.customId === "registro") {

        return interaction.showModal(
            criarModalRegistro()
        );

    }

    // ==================================================
    // ENTRADA FINANCEIRA
    // ==================================================

    if (interaction.customId === "financeiro_entrada") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("💰 Nova Entrada")

            .setDescription(
                "Selecione abaixo a categoria da entrada."
            );

        await interaction.reply({

            embeds: [embed],

            components: criarCategoriaFinanceira("entrada"),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // SAÍDA FINANCEIRA
    // ==================================================

    if (interaction.customId === "financeiro_saida") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERMELHO)

            .setTitle("💸 Nova Saída")

            .setDescription(
                "Selecione abaixo a categoria da saída."
            );

        await interaction.reply({

            embeds: [embed],

            components: criarCategoriaFinanceira("saida"),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // INICIAR EDITOR DE EMBEDS
    // ==================================================

    if (interaction.customId === "embed_novo") {

        criarEditor(interaction.user.id);

        const embed = gerarStatusEditor(
            interaction.user.id,
            interaction.guild
        );

        if (!embed) {

            await interaction.reply({

                content:
                    "❌ Não foi possível iniciar o editor de embeds.",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        await interaction.reply({

            embeds: [embed],

            components: criarEditorButtons(),

            flags: 64

        });

        return;

    }

    // ==================================================
    // EDITAR TÍTULO
    // ==================================================

    if (interaction.customId === "embed_titulo") {

        return interaction.showModal(
            criarModalTitulo()
        );

    }

    // ==================================================
    // EDITAR DESCRIÇÃO
    // ==================================================

    if (interaction.customId === "embed_descricao") {

        return interaction.showModal(
            criarModalDescricao()
        );

    }

    // ==================================================
    // EDITAR VISUAL
    // ==================================================

    if (interaction.customId === "embed_visual") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("🎨 Visual do Embed")

            .setDescription(
                "Escolha abaixo o que deseja editar."
            );

        await interaction.reply({

            embeds: [embed],

            components: criarVisualMenu(),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // CONFIGURAR IMAGENS
    // ==================================================

    if (interaction.customId === "embed_imagens") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("🖼 Imagens do Embed")

            .setDescription(
                "Escolha abaixo qual imagem deseja configurar."
            );

        await interaction.reply({

            embeds: [embed],

            components: criarImagemMenu(),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // ESCOLHER CANAL
    // ==================================================

    if (interaction.customId === "embed_canal") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("📢 Canal de Publicação")

            .setDescription(
                "Escolha o canal onde o embed será publicado."
            );

        await interaction.reply({

            embeds: [embed],

            components: criarCanalMenu(),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // ADICIONAR CAMPO
    // ==================================================

    if (interaction.customId === "embed_campo") {

        return interaction.showModal(
            criarModalCampo()
        );

    }

    // ==================================================
    // VISUALIZAR PRÉVIA
    // ==================================================

    if (interaction.customId === "embed_preview") {

        const previewCompleto =
            gerarPreviewCompleto(
                interaction.user.id,
                interaction.guild
            );

        if (!previewCompleto) {

            await interaction.reply({

                content:
                    "❌ Nenhum editor de embed foi encontrado.",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        await interaction.reply({

            embeds: previewCompleto,

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // PUBLICAR EMBED
    // ==================================================

    if (interaction.customId === "embed_publicar") {

        try {

            await publicarEmbed(
                interaction.client,
                interaction.user.id
            );

            await interaction.reply({

                content:
                    "✅ Embed publicado com sucesso.",

                flags: 64

            });

        } catch (error) {

            await interaction.reply({

                content:
                    `❌ ${error.message}`,

                flags: 64

            });

        }

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // CANCELAR EDITOR
    // ==================================================

    if (interaction.customId === "embed_cancelar") {

        removerEditor(interaction.user.id);

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERMELHO)

            .setTitle("❌ Editor cancelado")

            .setDescription(
                "Toda a edição do embed foi descartada."
            )

            .setFooter({

                text: "Padre Nosso MC"

            })

            .setTimestamp();

        await interaction.update({

            embeds: [embed],

            components: []

        });

        apagarResposta(interaction);

        return;

    }

}

module.exports = {

    handleButton

};