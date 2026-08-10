const {
    ACOES
} = require(
    "../config/acoes"
);

const {
    salvarAcao
} = require(
    "./acaoService"
);

// ======================================================
// CARREGAR CATÁLOGO NO BANCO
// ======================================================

async function carregarAcoes() {

    let cadastradas =
        0;

    let erros =
        0;

    for (
        const acao
        of ACOES
    ) {

        try {

            await salvarAcao(
                acao
            );

            cadastradas++;

        } catch (error) {

            erros++;

            console.error(
                `❌ Erro ao carregar ação "${acao.nome}":`,
                error
            );

        }

    }

    console.log(
        `🎯 Catálogo de ações carregado: ${cadastradas} ação(ões).`
    );

    if (erros > 0) {

        console.log(
            `⚠️ ${erros} ação(ões) apresentaram erro durante o carregamento.`
        );

    }

    return {
        cadastradas,
        erros
    };

}

module.exports = {
    carregarAcoes
};