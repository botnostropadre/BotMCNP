const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL - DESCRIÇÃO
// ======================================================

function criarModalDescricao() {

    const descricao = new TextInputBuilder()
        .setCustomId("descricao")
        .setLabel("Descrição do Embed")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(
`Você pode utilizar toda a formatação do Discord.

Exemplos:

# Título
## Subtítulo

**Negrito**
*Itálico*
__Sublinhado__
~~Riscado~~
||Spoiler||
> Citação

- Lista
\`Código\``
        )
        .setRequired(true)
        .setMaxLength(4000);

    return new ModalBuilder()
        .setCustomId("embed_modal_descricao")
        .setTitle("Editar Descrição")
        .addComponents(
            new ActionRowBuilder().addComponents(descricao)
        );

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {
    criarModalDescricao
};