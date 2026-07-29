const { gerarPreview } = require("./embedPreviewService");

const {
    obterEditor,
    removerEditor
} = require("./embedBuilderService");

async function publicarEmbed(client, userId) {

    const editor = obterEditor(userId);

    if (!editor) {
        throw new Error("Nenhum editor ativo encontrado.");
    }

    if (!editor.canal) {
        throw new Error("Selecione primeiro um canal de publicação.");
    }

    const canal = await client.channels.fetch(editor.canal).catch(() => null);

    if (!canal) {
        throw new Error("O canal selecionado não existe.");
    }

    const embed = gerarPreview(userId);

    if (!embed) {
        throw new Error("Não foi possível gerar o preview do embed.");
    }

    await canal.send({
        embeds: [embed]
    });

    removerEditor(userId);

    return true;
}

module.exports = {
    publicarEmbed
};