// ======================================================
// EVENTOS EM CRIAÇÃO
// ======================================================

const eventosEmCriacao =
    new Map();

const TEMPO_EXPIRACAO =
    30 * 60 * 1000;

// ======================================================
// CRIAR RASCUNHO
// ======================================================

function criarRascunhoEvento(
    userId,
    dados = {}
) {

    const agora =
        Date.now();

    const rascunho = {

        nome:
            dados.nome || "",

        descricao:
            dados.descricao || "",

        dataHora:
            dados.dataHora || "",

        traje:
            dados.traje || "",

        responsavel:
            dados.responsavel || "",

        quantidadeAuxiliares:
            0,

        flyer:
            "",

        criadoEm:
            agora,

        atualizadoEm:
            agora

    };

    eventosEmCriacao.set(
        userId,
        rascunho
    );

    setTimeout(() => {

        const eventoAtual =
            eventosEmCriacao.get(
                userId
            );

        if (!eventoAtual) return;

        const tempoSemAtualizacao =
            Date.now() -
            eventoAtual.atualizadoEm;

        if (
            tempoSemAtualizacao >=
            TEMPO_EXPIRACAO
        ) {

            eventosEmCriacao.delete(
                userId
            );

        }

    }, TEMPO_EXPIRACAO);

    return rascunho;

}

// ======================================================
// OBTER RASCUNHO
// ======================================================

function obterRascunhoEvento(
    userId
) {

    return (
        eventosEmCriacao.get(
            userId
        ) ||
        null
    );

}

// ======================================================
// ATUALIZAR RASCUNHO
// ======================================================

function atualizarRascunhoEvento(
    userId,
    dados = {}
) {

    const eventoAtual =
        obterRascunhoEvento(
            userId
        );

    if (!eventoAtual) {

        return criarRascunhoEvento(
            userId,
            dados
        );

    }

    const eventoAtualizado = {

        ...eventoAtual,

        ...dados,

        atualizadoEm:
            Date.now()

    };

    eventosEmCriacao.set(
        userId,
        eventoAtualizado
    );

    return eventoAtualizado;

}

// ======================================================
// REMOVER RASCUNHO
// ======================================================

function removerRascunhoEvento(
    userId
) {

    return eventosEmCriacao.delete(
        userId
    );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarRascunhoEvento,

    obterRascunhoEvento,

    atualizarRascunhoEvento,

    removerRascunhoEvento

};