const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

const {
    obterRascunhoParceiro,
    atualizarRascunhoParceiro
} = require(
    "../../services/parceiroBuilderService"
);

// ======================================================
// APAGAR RESPOSTA TEMPORÁRIA
// ======================================================

function apagarResposta(
    interaction,
    tempo = 10000
) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, tempo);

}

// ======================================================
// ETAPA DOS PRODUTOS PRINCIPAIS
// ======================================================

async function handleParceiroProdutos(
    interaction
) {

    if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
            "parceiro_modal_produtos"
    ) {

        return false;

    }

    const rascunho =
        obterRascunhoParceiro(
            interaction.user.id
        );

    if (!rascunho) {

        await interaction.reply({

            content:
                "❌ Nenhum cadastro de parceiro em andamento foi encontrado.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    const telefone3 =
        interaction.fields
            .getTextInputValue(
                "parceiro_telefone3"
            )
            .trim();

    const produto1 =
        interaction.fields
            .getTextInputValue(
                "parceiro_produto1"
            )
            .trim();

    const valor1 =
        interaction.fields
            .getTextInputValue(
                "parceiro_valor1"
            )
            .trim();

    const produto2 =
        interaction.fields
            .getTextInputValue(
                "parceiro_produto2"
            )
            .trim();

    const valor2 =
        interaction.fields
            .getTextInputValue(
                "parceiro_valor2"
            )
            .trim();

    // ==================================================
    // VALIDAR TERCEIRO RESPONSÁVEL
    // ==================================================

    if (
        rascunho.responsavel3 &&
        !telefone3
    ) {

        await interaction.reply({

            content:
                "❌ Informe o telefone do terceiro responsável.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    if (
        !rascunho.responsavel3 &&
        telefone3
    ) {

        await interaction.reply({

            content:
                "❌ Foi informado um telefone para o terceiro responsável, mas nenhum nome foi cadastrado.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    // ==================================================
    // VALIDAR PRODUTO PRINCIPAL
    // ==================================================

    if (
        !produto1 ||
        !valor1
    ) {

        await interaction.reply({

            content:
                "❌ O primeiro produto e o valor são obrigatórios.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    // ==================================================
    // VALIDAR SEGUNDO PRODUTO
    // ==================================================

    if (
        (produto2 && !valor2) ||
        (!produto2 && valor2)
    ) {

        await interaction.reply({

            content:
                "❌ Para cadastrar o segundo produto, informe também o valor correspondente.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    try {

        const produtos = [

            {
                nome:
                    produto1,

                valor:
                    valor1,

                ordem:
                    1
            }

        ];

        if (
            produto2 &&
            valor2
        ) {

            produtos.push({

                nome:
                    produto2,

                valor:
                    valor2,

                ordem:
                    2

            });

        }

        atualizarRascunhoParceiro(
            interaction.user.id,
            {
                telefone3,
                produtos
            }
        );

        const botoes =
            new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId(
                            "parceiro_continuar_produto_extra"
                        )

                        .setLabel(
                            "Continuar"
                        )

                        .setEmoji("➡️")

                        .setStyle(
                            ButtonStyle.Success
                        ),

                    new ButtonBuilder()

                        .setCustomId(
                            "parceiro_cancelar"
                        )

                        .setLabel(
                            "Cancelar"
                        )

                        .setEmoji("❌")

                        .setStyle(
                            ButtonStyle.Danger
                        )

                );

        await interaction.reply({

            content:
`✅ Produtos principais salvos.

Clique em **Continuar** para cadastrar o terceiro produto opcional e finalizar a parceria.`,

            components:
                [botoes],

            flags:
                MessageFlags.Ephemeral

        });

    } catch (error) {

        console.error(
            "Erro ao salvar produtos principais do parceiro:",
            error
        );

        await interaction.reply({

            content:
                "❌ Não foi possível salvar os produtos do parceiro.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

    }

    return true;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    handleParceiroProdutos
};