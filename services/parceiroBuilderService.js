// ======================================================
// PARCEIROS EM CRIAÇÃO
// ======================================================

const parceirosEmCriacao =
    new Map();

const TEMPO_EXPIRACAO =
    30 * 60 * 1000;

// ======================================================
// CRIAR RASCUNHO
// ======================================================

function criarRascunhoParceiro(
    userId,
    dados = {}
) {

    const agora =
        Date.now();

    const rascunho = {

        nomeFaccao:
            dados.nomeFaccao || "",

        categoria:
            dados.categoria || "",

        responsavel1:
            dados.responsavel1 || "",

        telefone1:
            dados.telefone1 || "",

        responsavel2:
            dados.responsavel2 || "",

        telefone2:
            dados.telefone2 || "",

        responsavel3:
            dados.responsavel3 || "",

        telefone3:
            dados.telefone3 || "",

        produtos:
            Array.isArray(dados.produtos)
                ? dados.produtos
                : [],

        criadoEm:
            agora,

        atualizadoEm:
            agora

    };

    parceirosEmCriacao.set(
        userId,
        rascunho
    );

    setTimeout(() => {

        const rascunhoAtual =
            parceirosEmCriacao.get(
                userId
            );

        if (!rascunhoAtual) return;

        const tempoSemAtualizacao =
            Date.now() -
            rascunhoAtual.atualizadoEm;

        if (
            tempoSemAtualizacao >=
            TEMPO_EXPIRACAO
        ) {

            parceirosEmCriacao.delete(
                userId
            );

        }

    }, TEMPO_EXPIRACAO);

    return rascunho;

}

// ======================================================
// OBTER RASCUNHO
// ======================================================

function obterRascunhoParceiro(
    userId
) {

    return (
        parceirosEmCriacao.get(
            userId
        ) ||
        null
    );

}

// ======================================================
// ATUALIZAR RASCUNHO
// ======================================================

function atualizarRascunhoParceiro(
    userId,
    dados = {}
) {

    const rascunhoAtual =
        obterRascunhoParceiro(
            userId
        );

    if (!rascunhoAtual) {

        return criarRascunhoParceiro(
            userId,
            dados
        );

    }

    const rascunhoAtualizado = {

        ...rascunhoAtual,

        ...dados,

        atualizadoEm:
            Date.now()

    };

    parceirosEmCriacao.set(
        userId,
        rascunhoAtualizado
    );

    return rascunhoAtualizado;

}

// ======================================================
// ADICIONAR PRODUTOS AO RASCUNHO
// ======================================================

function definirProdutosParceiro(
    userId,
    produtos = []
) {

    const rascunho =
        obterRascunhoParceiro(
            userId
        );

    if (!rascunho) {

        throw new Error(
            "Nenhum cadastro de parceiro em andamento foi encontrado."
        );

    }

    const produtosValidos =
        produtos.filter(produto => {

            return (
                produto &&
                produto.nome?.trim() &&
                produto.valor?.trim()
            );

        });

    if (
        produtosValidos.length === 0
    ) {

        throw new Error(
            "Informe pelo menos um produto e valor."
        );

    }

    if (
        produtosValidos.length > 3
    ) {

        throw new Error(
            "Cada parceiro pode possuir no máximo três produtos."
        );

    }

    rascunho.produtos =
        produtosValidos.map(
            (produto, indice) => ({

                nome:
                    produto.nome.trim(),

                valor:
                    produto.valor.trim(),

                ordem:
                    indice + 1

            })
        );

    rascunho.atualizadoEm =
        Date.now();

    parceirosEmCriacao.set(
        userId,
        rascunho
    );

    return rascunho;

}

// ======================================================
// REMOVER RASCUNHO
// ======================================================

function removerRascunhoParceiro(
    userId
) {

    return parceirosEmCriacao.delete(
        userId
    );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarRascunhoParceiro,

    obterRascunhoParceiro,

    atualizarRascunhoParceiro,

    definirProdutosParceiro,

    removerRascunhoParceiro

};