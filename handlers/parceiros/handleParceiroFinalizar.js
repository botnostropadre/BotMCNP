const {
    MessageFlags
} = require("discord.js");

const {
    obterRascunhoParceiro,
    definirProdutosParceiro,
    removerRascunhoParceiro
} = require(
    "../../services/parceiroBuilderService"
);

const {
    salvarParceiro
} = require(
    "../../services/parceiroService"
);

const {
    atualizarParceiros
} = require(
    "../../services/atualizarParceiros"
);

// ======================================================
// APAGAR RESPOSTA TEMPORÁRIA
// ======================================================

function apagarResposta(
    interaction,
    tempo = 15000
) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, tempo);

}

// ======================================================
// FINALIZAR CADASTRO DO PARCEIRO
// ======================================================

async function handleParceiroFinalizar(
    interaction
) {

    if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
            "parceiro_modal_produto_extra"
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

    const produto3 =
        interaction.fields
            .getTextInputValue(
                "parceiro_produto3"
            )
            .trim();

    const valor3 =
        interaction.fields
            .getTextInputValue(
                "parceiro_valor3"
            )
            .trim();

    if (
        (produto3 && !valor3) ||
        (!produto3 && valor3)
    ) {

        await interaction.reply({

            content:
                "❌ Para cadastrar o terceiro produto, informe também o valor correspondente.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    try {

        const produtos =
            Array.isArray(
                rascunho.produtos
            )
                ? [...rascunho.produtos]
                : [];

        if (
            produto3 &&
            valor3
        ) {

            produtos.push({

                nome:
                    produto3,

                valor:
                    valor3,

                ordem:
                    3

            });

        }

        definirProdutosParceiro(
            interaction.user.id,
            produtos
        );

        const parceiroCompleto =
            obterRascunhoParceiro(
                interaction.user.id
            );

        if (!parceiroCompleto) {

            throw new Error(
                "O cadastro do parceiro não foi encontrado."
            );

        }

        await interaction.deferReply({

            flags:
                MessageFlags.Ephemeral

        });

        const parceiroSalvo =
            await salvarParceiro({

                ...parceiroCompleto,

                criadoPor:
                    interaction.user.id,

                dataCriacao:
                    new Date().toLocaleString(
                        "pt-BR"
                    )

            });

        await atualizarParceiros(
            interaction.client
        );

        removerRascunhoParceiro(
            interaction.user.id
        );

        await interaction.editReply({

            content:
`✅ Parceiro cadastrado com sucesso!

🏛️ **Facção:** ${parceiroSalvo.nomeFaccao}

📦 **Categoria:** ${parceiroSalvo.categoria}

📋 **Produtos cadastrados:** ${parceiroSalvo.produtos.length}

O painel do canal de parceiros foi atualizado automaticamente.`

        });

        apagarResposta(interaction);

    } catch (error) {

        console.error(
            "Erro ao finalizar cadastro do parceiro:",
            error
        );

        const mensagemErro =
            error.message ||
            "Não foi possível finalizar o cadastro do parceiro.";

        if (
            interaction.deferred ||
            interaction.replied
        ) {

            await interaction.editReply({

                content:
                    `❌ ${mensagemErro}`

            }).catch(() => {});

        } else {

            await interaction.reply({

                content:
                    `❌ ${mensagemErro}`,

                flags:
                    MessageFlags.Ephemeral

            }).catch(() => {});

        }

        apagarResposta(interaction);

    }

    return true;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    handleParceiroFinalizar
};