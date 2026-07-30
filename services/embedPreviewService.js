const {
    EmbedBuilder
} = require("discord.js");

const {
    obterEditor
} = require("./embedBuilderService");

const COLORS = require("../config/colors");

// ======================================================
// GERAR EMBED FINAL
// ======================================================

function gerarPreview(userId) {

    const editor = obterEditor(userId);

    if (!editor) return null;

    const embed = new EmbedBuilder()
        .setColor(editor.cor || COLORS.VERDE);

    // ==================================================
    // TÍTULO
    // ==================================================

    if (editor.titulo?.trim()) {

        embed.setTitle(
            editor.titulo.trim()
        );

    }

    // ==================================================
    // DESCRIÇÃO
    // ==================================================

    if (editor.descricao?.trim()) {

        embed.setDescription(
            editor.descricao.trim()
        );

    }

    // ==================================================
    // CAMPOS
    // ==================================================

    if (
        Array.isArray(editor.campos) &&
        editor.campos.length > 0
    ) {

        embed.addFields(
            editor.campos
        );

    }

    // ==================================================
    // FAIXA INFERIOR
    // ==================================================

    if (editor.faixa?.trim()) {

        embed.setImage(
            editor.faixa.trim()
        );

    }

    // ==================================================
    // RODAPÉ
    // ==================================================

    if (editor.rodape?.trim()) {

        embed.setFooter({
            text: editor.rodape.trim()
        });

    }

    return embed;

}

// ======================================================
// GERAR INFORMAÇÕES DO PREVIEW
// ======================================================

function gerarInformacoesPreview(
    userId,
    guild
) {

    const editor = obterEditor(userId);

    if (!editor) return null;

    const quantidadeCampos =
        Array.isArray(editor.campos)
            ? editor.campos.length
            : 0;

    let canalTexto =
        "❌ Não selecionado";

    if (editor.canal && guild) {

        const canal =
            guild.channels.cache.get(
                editor.canal
            );

        canalTexto = canal
            ? `${canal}`
            : "⚠️ Canal não encontrado";

    }

    const corTexto =
        typeof editor.cor === "string"
            ? editor.cor.toUpperCase()
            : "Não definida";

    const informacoes =
        new EmbedBuilder()

            .setColor(
                editor.cor ||
                COLORS.VERDE
            )

            .setTitle(
                "👁 Prévia do Embed"
            )

            .setDescription(
`Confira abaixo as informações antes de publicar.

📢 **Canal:** ${canalTexto}

🎨 **Cor:** \`${corTexto}\`

➕ **Campos:** ${quantidadeCampos}

O próximo embed representa exatamente como a publicação será enviada.`
            )

            .setFooter({
                text: "Padre Nosso MC"
            });

    return informacoes;

}

// ======================================================
// GERAR PREVIEW COMPLETO
// ======================================================

function gerarPreviewCompleto(
    userId,
    guild
) {

    const informacoes =
        gerarInformacoesPreview(
            userId,
            guild
        );

    const preview =
        gerarPreview(userId);

    if (
        !informacoes ||
        !preview
    ) {

        return null;

    }

    return [
        informacoes,
        preview
    ];

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {

    gerarPreview,
    gerarInformacoesPreview,
    gerarPreviewCompleto

};