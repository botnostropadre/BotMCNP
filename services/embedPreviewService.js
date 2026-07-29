const {
    EmbedBuilder
} = require("discord.js");

const {
    obterEditor
} = require("./embedBuilderService");

function gerarPreview(userId) {

    const editor = obterEditor(userId);

    if (!editor) return null;

    const embed = new EmbedBuilder()

        .setColor(editor.cor || "#2ECC71");

    // ==========================
    // TÍTULO
    // ==========================

    if (editor.titulo)

        embed.setTitle(editor.titulo);

    // ==========================
    // DESCRIÇÃO
    // ==========================

    if (editor.descricao)

        embed.setDescription(editor.descricao);

    // ==========================
    // AUTOR
    // ==========================

    if (editor.autor?.nome) {

        embed.setAuthor({

            name: editor.autor.nome,

            iconURL: editor.autor.icone || undefined

        });

    }

    // ==========================
    // RODAPÉ
    // ==========================

    if (editor.rodape?.texto) {

        embed.setFooter({

            text: editor.rodape.texto,

            iconURL: editor.rodape.icone || undefined

        });

    }

    // ==========================
    // THUMBNAIL
    // ==========================

    if (editor.thumbnail)

        embed.setThumbnail(editor.thumbnail);

    // ==========================
    // IMAGEM
    // ==========================

    if (editor.imagem)

        embed.setImage(editor.imagem);

    // ==========================
    // CAMPOS
    // ==========================

    if (editor.campos.length > 0) {

        embed.addFields(editor.campos);

    }

    // ==========================
    // TIMESTAMP
    // ==========================

    if (editor.timestamp)

        embed.setTimestamp();

    return embed;

}

module.exports = {

    gerarPreview

};