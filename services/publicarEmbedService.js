const { gerarPreview } = require("./embedPreviewService");

const {
    obterEditor,
    removerEditor
} = require("./embedBuilderService");

// ======================================================
// PUBLICAR EMBED
// ======================================================

async function publicarEmbed(client, userId) {

    const editor = obterEditor(userId);

    if (!editor) {
        throw new Error("Nenhum editor ativo encontrado.");
    }

    if (!editor.canal) {
        throw new Error("Selecione primeiro um canal de publicação.");
    }

    const canal = await client.channels
        .fetch(editor.canal)
        .catch(() => null);

    if (!canal) {
        throw new Error("O canal selecionado não existe.");
    }

    if (!canal.isTextBased()) {
        throw new Error("O canal selecionado não permite o envio de mensagens.");
    }

    const embed = gerarPreview(userId);

    if (!embed) {
        throw new Error("Não foi possível gerar o embed.");
    }

    const dadosEmbed = embed.toJSON();

    const possuiConteudo =
        dadosEmbed.title ||
        dadosEmbed.description ||
        dadosEmbed.footer ||
        dadosEmbed.image ||
        dadosEmbed.fields?.length > 0;

    if (!possuiConteudo) {
        throw new Error("Adicione algum conteúdo antes de publicar o embed.");
    }

    const mensagem = await canal.send({
        embeds: [embed]
    });

    removerEditor(userId);

    return mensagem;
}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    publicarEmbed
};