const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

// ======================================================
// MENU — SELECIONAR PARCEIRO
// ======================================================

function criarParceiroGerenciarMenu(
    parceiros = []
) {

    const opcoes =
        parceiros
            .slice(
                0,
                25
            )
            .map(
                parceiro => {

                    return {

                        label:
                            String(
                                parceiro.nomeFaccao ||
                                `Parceiro ${parceiro.id}`
                            )
                                .slice(
                                    0,
                                    100
                                ),

                        description:
                            String(
                                parceiro.produto ||
                                "Produto não informado"
                            )
                                .slice(
                                    0,
                                    100
                                ),

                        value:
                            String(
                                parceiro.id
                            )

                    };

                }
            );

    return [

        new ActionRowBuilder()

            .addComponents(

                new StringSelectMenuBuilder()

                    .setCustomId(
                        "parceiro_gerenciar_selecionar"
                    )

                    .setPlaceholder(
                        "Selecione a FAC que deseja gerenciar"
                    )

                    .addOptions(
                        opcoes
                    )

            )

    ];

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarParceiroGerenciarMenu
};