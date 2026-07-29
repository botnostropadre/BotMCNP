const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");

const { criarCategoriaFinanceira } = require("../selectMenus/categoriaFinanceira");
const { criarModalRegistro } = require("../modals/registroModal");
const { criarEditorButtons } = require("../buttons/embedEditorButtons");
const { criarModalTitulo } = require("../modals/embedTituloModal");
const { criarModalDescricao } = require("../modals/embedDescricaoModal");
const { criarVisualMenu } = require("../selectMenus/embedVisualMenu");
const { criarImagemMenu } = require("../selectMenus/embedImagemMenu");
const { criarModalCampo } = require("../modals/embedCampoModal");

const {
    criarEditor
} = require("../services/embedBuilderService");

const {
    gerarPreview
} = require("../services/embedPreviewService");
const {
    criarCanalMenu
} = require("../selectMenus/embedCanalMenu");
const {
    publicarEmbed
} = require("../services/publicarEmbedService");

async function handleButton(interaction) {

    if (!interaction.isButton()) return;

    // ==========================
    // REGISTRO
    // ==========================

    if (interaction.customId === "registro") {

        return interaction.showModal(
            criarModalRegistro()
        );

    }

    // ==========================
    // ENTRADA FINANCEIRA
    // ==========================

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

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

        return;

    }

    // ==========================
    // SAÍDA FINANCEIRA
    // ==========================

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

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

        return;

    }

    // ==========================
    // EDITOR DE EMBEDS
    // ==========================

    if (interaction.customId === "embed_novo") {

        criarEditor(interaction.user.id);

        const embed = new EmbedBuilder()

            .setColor("#2ECC71")

            .setTitle("📝 Editor de Embeds")

            .setDescription(`### Bem-vindo ao Editor.

Escolha uma das opções abaixo para começar.

📝 Título

📄 Descrição

🎨 Visual

🖼 Imagens

📢 Canal de destino

➕ Campo

👁 Preview

✅ Publicar`);

        return interaction.update({

            embeds: [embed],

            components: criarEditorButtons()

        });

    }

    // ==========================
    // EDITAR TÍTULO
    // ==========================

    if (interaction.customId === "embed_titulo") {

        return interaction.showModal(
            criarModalTitulo()
        );

    }

    // ==========================
    // EDITAR DESCRIÇÃO
    // ==========================

    if (interaction.customId === "embed_descricao") {

        return interaction.showModal(
            criarModalDescricao()
        );

    }

    // ==========================
    // VISUAL
    // ==========================

    if (interaction.customId === "embed_visual") {

        const embed = new EmbedBuilder()

            .setColor("#2ECC71")

            .setTitle("🎨 Visual do Embed")

            .setDescription(
                "Escolha abaixo o que deseja editar."
            );

        await interaction.reply({

            embeds: [embed],

            components: criarVisualMenu(),

            flags: 64

        });

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

        return;

    }

    // ==========================
    // IMAGENS
    // ==========================

    if (interaction.customId === "embed_imagens") {

        const embed = new EmbedBuilder()

            .setColor("#2ECC71")

            .setTitle("🖼 Imagens")

            .setDescription(
                "Escolha qual imagem deseja configurar."
            );

        await interaction.reply({

            embeds: [embed],

            components: criarImagemMenu(),

            flags: 64

        });

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

        return;

    }
// ==========================
// CANAL
// ==========================

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

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, 10000);

    return;

}
    // ==========================
    // ADICIONAR CAMPO
    // ==========================

    if (interaction.customId === "embed_campo") {

        return interaction.showModal(
            criarModalCampo()
        );

    }

    // ==========================
    // PREVIEW
    // ==========================

    if (interaction.customId === "embed_preview") {

        const preview = gerarPreview(
            interaction.user.id
        );

        if (!preview) {

            await interaction.reply({

                content: "❌ Nenhum editor encontrado.",

                flags: 64

            });

            setTimeout(async () => {

                try {

                    await interaction.deleteReply();

                } catch {}

            }, 10000);

            return;

        }

        await interaction.reply({

            embeds: [preview],

            flags: 64

        });

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

        return;

    }


// ==========================
// PUBLICAR
// ==========================

if (interaction.customId === "embed_publicar") {

    try {

        await publicarEmbed(

            interaction.client,

            interaction.user.id

        );

        await interaction.reply({

            content: "✅ Embed publicado com sucesso.",

            flags: 64

        });


    } catch (err) {


        await interaction.reply({

            content: `❌ ${err.message}`,

            flags: 64

        });

    }


    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, 10000);


    return;

    }

}


module.exports = {

    handleButton

};