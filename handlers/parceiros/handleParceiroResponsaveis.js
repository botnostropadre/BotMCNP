const {
    MessageFlags
} = require("discord.js");

const {
    obterRascunhoParceiro,
    atualizarRascunhoParceiro
} = require(
    "../../services/parceiroBuilderService"
);

const {
    criarParceiroProdutosButtons
} = require(
    "../../buttons/parceirosButton"
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
// ETAPA DOS RESPONSÁVEIS
// ======================================================

async function handleParceiroResponsaveis(
    interaction
) {

    if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
            "parceiro_modal_responsaveis"
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

    const responsavel1 =
        interaction.fields
            .getTextInputValue(
                "parceiro_responsavel1"
            )
            .trim();

    const telefone1 =
        interaction.fields
            .getTextInputValue(
                "parceiro_telefone1"
            )
            .trim();

    const responsavel2 =
        interaction.fields
            .getTextInputValue(
                "parceiro_responsavel2"
            )
            .trim();

    const telefone2 =
        interaction.fields
            .getTextInputValue(
                "parceiro_telefone2"
            )
            .trim();

    const responsavel3 =
        interaction.fields
            .getTextInputValue(
                "parceiro_responsavel3"
            )
            .trim();

    if (
        !responsavel1 ||
        !telefone1
    ) {

        await interaction.reply({

            content:
                "❌ O primeiro responsável e o telefone são obrigatórios.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    if (
        (responsavel2 && !telefone2) ||
        (!responsavel2 && telefone2)
    ) {

        await interaction.reply({

            content:
                "❌ Para cadastrar o segundo responsável, informe também o telefone correspondente.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    try {

        atualizarRascunhoParceiro(
            interaction.user.id,
            {
                responsavel1,
                telefone1,
                responsavel2,
                telefone2,
                responsavel3
            }
        );

        await interaction.reply({

            content:
`✅ Responsáveis salvos com sucesso.

Clique em **Cadastrar Produtos** para informar:

📞 Telefone do terceiro responsável  
📦 Produto 1 e valor  
📦 Produto 2 e valor`,

            components:
                criarParceiroProdutosButtons(),

            flags:
                MessageFlags.Ephemeral

        });

    } catch (error) {

        console.error(
            "Erro ao salvar responsáveis do parceiro:",
            error
        );

        await interaction.reply({

            content:
                "❌ Não foi possível salvar os responsáveis.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

    }

    return true;

}

module.exports = {
    handleParceiroResponsaveis
};