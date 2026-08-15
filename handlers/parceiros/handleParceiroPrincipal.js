const {
    MessageFlags
} = require("discord.js");

const db =
    require("../../database/database");

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
// EXECUTAR SQL
// ======================================================

function executar(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.run(
                sql,
                parametros,
                function (error) {

                    if (error) {

                        return reject(
                            error
                        );

                    }

                    resolve(this);

                }
            );

        }
    );

}

// ======================================================
// CADASTRAR PARCEIRO
// ======================================================

async function handleParceiroPrincipal(
    interaction
) {

    if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
            "parceiro_modal_principal"
    ) {

        return false;

    }

    // ==================================================
    // RESPONDER IMEDIATAMENTE
    // ==================================================

    await interaction.deferReply({

        flags:
            MessageFlags.Ephemeral

    });

    try {

        // ==================================================
        // COLETAR DADOS
        // ==================================================

        const nomeFaccao =
            interaction.fields
                .getTextInputValue(
                    "parceiro_nome_faccao"
                )
                .trim();

        const produto =
            interaction.fields
                .getTextInputValue(
                    "parceiro_produto"
                )
                .trim();

        const descricao =
            interaction.fields
                .getTextInputValue(
                    "parceiro_descricao"
                )
                .trim();

        const salaDarkChat =
            interaction.fields
                .getTextInputValue(
                    "parceiro_sala_darkchat"
                )
                .trim();

        const senhaSala =
            interaction.fields
                .getTextInputValue(
                    "parceiro_senha_sala"
                )
                .trim();

        // ==================================================
        // VALIDAR CAMPOS
        // ==================================================

        if (!nomeFaccao) {

            throw new Error(
                "Informe o nome da FAC."
            );

        }

        if (!produto) {

            throw new Error(
                "Informe o produto que a FAC trabalha."
            );

        }

        if (!descricao) {

            throw new Error(
                "Informe uma descrição da parceria."
            );

        }

        if (!salaDarkChat) {

            throw new Error(
                "Informe a sala do Dark Chat."
            );

        }

        if (!senhaSala) {

            throw new Error(
                "Informe a senha da sala."
            );

        }

        // ==================================================
        // DATA DO CADASTRO
        // ==================================================

        const dataCriacao =
            new Date()
                .toLocaleString(
                    "pt-BR"
                );

        // ==================================================
        // SALVAR NO BANCO
        // ==================================================
        //
        // categoria, responsavel1 e telefone1 recebem ""
        // apenas por compatibilidade com bancos antigos
        // que possuam NOT NULL nessas colunas.
        //
        // O sistema NÃO coleta mais essas informações.
        // ==================================================

        const resultado =
            await executar(
                `
                    INSERT INTO parceiros
                    (
                        nomeFaccao,

                        produto,

                        descricao,

                        salaDarkChat,

                        senhaSala,

                        criadoPor,

                        dataCriacao,

                        categoria,

                        responsavel1,

                        telefone1
                    )

                    VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                    )
                `,
                [
                    nomeFaccao,

                    produto,

                    descricao,

                    salaDarkChat,

                    senhaSala,

                    interaction.user.id,

                    dataCriacao,

                    "",

                    "",

                    ""
                ]
            );

        // ==================================================
        // ATUALIZAR PAINEL DOS PARCEIROS
        // ==================================================

        try {

            await atualizarParceiros(
                interaction.client
            );

        } catch (error) {

            console.error(
                "Parceiro salvo, mas ocorreu erro ao atualizar o painel:",
                error
            );

        }

        // ==================================================
        // CONFIRMAÇÃO
        // ==================================================

        await interaction.editReply({

            content:
`✅ **Parceiro cadastrado com sucesso!**

🏛️ **FAC:** ${nomeFaccao}

📦 **Produto:** ${produto}

💬 **Sala Dark Chat:** ${salaDarkChat}

🔐 **Senha:** ${senhaSala}

🆔 **Registro:** #${resultado.lastID}

O painel de parceiros foi atualizado automaticamente.`

        });

        apagarResposta(
            interaction
        );

    } catch (error) {

        console.error(
            "Erro ao cadastrar parceiro:",
            error
        );

        await interaction.editReply({

            content:
                `❌ Não foi possível cadastrar o parceiro.\n\n` +
                `Erro: ${error.message}`

        }).catch(
            () => {}
        );

        apagarResposta(
            interaction
        );

    }

    return true;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    handleParceiroPrincipal
};