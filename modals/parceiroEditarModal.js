const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL — EDITAR PARCEIRO
// ======================================================

function criarParceiroEditarModal(
    parceiro
) {

    const nomeFaccao =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_editar_nome"
            )

            .setLabel(
                "Nome da FAC"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setValue(
                String(
                    parceiro.nomeFaccao || ""
                ).slice(
                    0,
                    100
                )
            )

            .setMaxLength(
                100
            )

            .setRequired(
                true
            );

    const produto =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_editar_produto"
            )

            .setLabel(
                "Produto que trabalha"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setValue(
                String(
                    parceiro.produto || ""
                ).slice(
                    0,
                    100
                )
            )

            .setMaxLength(
                100
            )

            .setRequired(
                true
            );

    const descricao =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_editar_descricao"
            )

            .setLabel(
                "Descrição"
            )

            .setStyle(
                TextInputStyle.Paragraph
            )

            .setValue(
                String(
                    parceiro.descricao || ""
                ).slice(
                    0,
                    4000
                )
            )

            .setMaxLength(
                4000
            )

            .setRequired(
                true
            );

    const salaDarkChat =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_editar_sala"
            )

            .setLabel(
                "Sala do Dark Chat"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setValue(
                String(
                    parceiro.salaDarkChat || ""
                ).slice(
                    0,
                    100
                )
            )

            .setMaxLength(
                100
            )

            .setRequired(
                true
            );

    const senhaSala =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_editar_senha"
            )

            .setLabel(
                "Senha da sala"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setValue(
                String(
                    parceiro.senhaSala || ""
                ).slice(
                    0,
                    100
                )
            )

            .setMaxLength(
                100
            )

            .setRequired(
                true
            );

    return new ModalBuilder()

        .setCustomId(
            `parceiro_editar_modal_${parceiro.id}`
        )

        .setTitle(
            "Editar Parceiro"
        )

        .addComponents(

            new ActionRowBuilder()
                .addComponents(
                    nomeFaccao
                ),

            new ActionRowBuilder()
                .addComponents(
                    produto
                ),

            new ActionRowBuilder()
                .addComponents(
                    descricao
                ),

            new ActionRowBuilder()
                .addComponents(
                    salaDarkChat
                ),

            new ActionRowBuilder()
                .addComponents(
                    senhaSala
                )

        );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarParceiroEditarModal
};