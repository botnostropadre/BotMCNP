const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

// ======================================================
// MODAL — CADASTRO DE PARCEIRO
// ======================================================

function criarParceiroPrincipalModal() {

    // ==================================================
    // NOME DA FAC
    // ==================================================

    const nomeFaccao =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_nome_faccao"
            )

            .setLabel(
                "Nome da FAC"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: Cosa Bianca"
            )

            .setMaxLength(100)

            .setRequired(true);

    // ==================================================
    // PRODUTO
    // ==================================================

    const produto =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_produto"
            )

            .setLabel(
                "Produto que trabalha"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: Munição"
            )

            .setMaxLength(100)

            .setRequired(true);

    // ==================================================
    // DESCRIÇÃO
    // ==================================================

    const descricao =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_descricao"
            )

            .setLabel(
                "Descrição"
            )

            .setStyle(
                TextInputStyle.Paragraph
            )

            .setPlaceholder(
                "Descreva informações importantes sobre a parceria..."
            )

            // Limite máximo permitido pelo Discord
            .setMaxLength(4000)

            .setRequired(true);

    // ==================================================
    // SALA DO DARK CHAT
    // ==================================================

    const salaDarkChat =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_sala_darkchat"
            )

            .setLabel(
                "Sala do Dark Chat"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Ex.: Cosa Bianca"
            )

            .setMaxLength(100)

            .setRequired(true);

    // ==================================================
    // SENHA DA SALA
    // ==================================================

    const senhaSala =
        new TextInputBuilder()

            .setCustomId(
                "parceiro_senha_sala"
            )

            .setLabel(
                "Senha da sala"
            )

            .setStyle(
                TextInputStyle.Short
            )

            .setPlaceholder(
                "Digite a senha da sala"
            )

            .setMaxLength(100)

            .setRequired(true);

    // ==================================================
    // MODAL
    // ==================================================

    return new ModalBuilder()

        .setCustomId(
            "parceiro_modal_principal"
        )

        .setTitle(
            "Registrar Parceiro"
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
    criarParceiroPrincipalModal
};