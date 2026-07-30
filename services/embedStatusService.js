const { EmbedBuilder } = require("discord.js");

const COLORS = require("../config/colors");

const {
    obterEditor
} = require("./embedBuilderService");

// ======================================================
// GERAR PAINEL DE STATUS DO EDITOR
// ======================================================

function gerarStatusEditor(userId, guild) {

    const editor = obterEditor(userId);

    if (!editor) return null;

    const possuiTitulo =
        Boolean(editor.titulo?.trim());

    const possuiDescricao =
        Boolean(editor.descricao?.trim());

    const possuiRodape =
        Boolean(editor.rodape?.trim());

    const possuiFaixa =
        Boolean(editor.faixa?.trim());

    const possuiCanal =
        Boolean(editor.canal);

    const quantidadeCampos =
        Array.isArray(editor.campos)
            ? editor.campos.length
            : 0;

    let canalTexto = "❌ Não selecionado";

    if (possuiCanal && guild) {

        const canal =
            guild.channels.cache.get(editor.canal);

        canalTexto = canal
            ? `${canal}`
            : "⚠️ Canal não encontrado";

    }

    const corTexto =
        typeof editor.cor === "string"
            ? editor.cor.toUpperCase()
            : "Não definida";

    const embed = new EmbedBuilder()

        .setColor(editor.cor || COLORS.VERDE)

        .setTitle("📝 Editor de Embeds")

        .setDescription(
`Configure o embed utilizando os botões abaixo.

**Status atual**

📝 **Título:** ${possuiTitulo ? "✅ Configurado" : "❌ Não configurado"}

📄 **Descrição:** ${possuiDescricao ? "✅ Configurada" : "❌ Não configurada"}

🎨 **Cor:** \`${corTexto}\`

📑 **Rodapé:** ${possuiRodape ? "✅ Configurado" : "❌ Não configurado"}

🖼 **Faixa:** ${possuiFaixa ? "✅ Configurada" : "❌ Não configurada"}

📢 **Canal:** ${canalTexto}

➕ **Campos:** ${quantidadeCampos}

Use **Preview** para conferir o resultado antes de publicar.`
        )

        .setFooter({
            text: "Padre Nosso MC"
        });

    return embed;

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    gerarStatusEditor
};