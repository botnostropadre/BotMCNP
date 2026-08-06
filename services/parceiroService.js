const db = require("../database/database");

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
                        return reject(error);
                    }

                    resolve(this);

                }
            );

        }
    );

}

// ======================================================
// CONSULTAR UMA LINHA
// ======================================================

function consultarUm(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.get(
                sql,
                parametros,
                (error, row) => {

                    if (error) {
                        return reject(error);
                    }

                    resolve(row || null);

                }
            );

        }
    );

}

// ======================================================
// CONSULTAR TODAS AS LINHAS
// ======================================================

function consultarTodos(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.all(
                sql,
                parametros,
                (error, rows) => {

                    if (error) {
                        return reject(error);
                    }

                    resolve(rows || []);

                }
            );

        }
    );

}

// ======================================================
// SALVAR PARCEIRO
// ======================================================

async function salvarParceiro(dados) {

    if (!dados?.nomeFaccao?.trim()) {

        throw new Error(
            "O nome da facção é obrigatório."
        );

    }

    if (!dados?.categoria?.trim()) {

        throw new Error(
            "A categoria do parceiro é obrigatória."
        );

    }

    if (
        !dados?.responsavel1?.trim() ||
        !dados?.telefone1?.trim()
    ) {

        throw new Error(
            "O primeiro responsável e o telefone são obrigatórios."
        );

    }

    if (
        !Array.isArray(dados.produtos) ||
        dados.produtos.length === 0
    ) {

        throw new Error(
            "Informe pelo menos um produto e valor."
        );

    }

    await executar(
        "BEGIN IMMEDIATE TRANSACTION"
    );

    try {

        const resultado =
            await executar(
                `
                    INSERT INTO parceiros (

                        nomeFaccao,
                        categoria,
                        responsavel1,
                        telefone1,
                        responsavel2,
                        telefone2,
                        responsavel3,
                        telefone3,
                        criadoPor,
                        dataCriacao

                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    dados.nomeFaccao.trim(),
                    dados.categoria.trim(),
                    dados.responsavel1.trim(),
                    dados.telefone1.trim(),
                    dados.responsavel2?.trim() || null,
                    dados.telefone2?.trim() || null,
                    dados.responsavel3?.trim() || null,
                    dados.telefone3?.trim() || null,
                    dados.criadoPor,
                    dados.dataCriacao ||
                        new Date().toLocaleString(
                            "pt-BR"
                        )
                ]
            );

        const parceiroId =
            resultado.lastID;

        for (
            let indice = 0;
            indice < dados.produtos.length;
            indice++
        ) {

            const produto =
                dados.produtos[indice];

            await executar(
                `
                    INSERT INTO parceiroProdutos (

                        parceiroId,
                        produto,
                        valor,
                        ordem

                    )
                    VALUES (?, ?, ?, ?)
                `,
                [
                    parceiroId,
                    produto.nome.trim(),
                    produto.valor.trim(),
                    indice + 1
                ]
            );

        }

        await executar(
            "COMMIT"
        );

        return buscarParceiro(
            parceiroId
        );

    } catch (error) {

        await executar(
            "ROLLBACK"
        ).catch(() => {});

        throw error;

    }

}

// ======================================================
// BUSCAR PARCEIRO
// ======================================================

async function buscarParceiro(
    parceiroId
) {

    const parceiro =
        await consultarUm(
            `
                SELECT *
                FROM parceiros
                WHERE id = ?
            `,
            [
                parceiroId
            ]
        );

    if (!parceiro) {

        return null;

    }

    const produtos =
        await consultarTodos(
            `
                SELECT *
                FROM parceiroProdutos
                WHERE parceiroId = ?
                ORDER BY ordem ASC, id ASC
            `,
            [
                parceiroId
            ]
        );

    return {
        ...parceiro,
        produtos
    };

}

// ======================================================
// LISTAR PARCEIROS
// ======================================================

async function listarParceiros() {

    const parceiros =
        await consultarTodos(
            `
                SELECT *
                FROM parceiros
                ORDER BY nomeFaccao COLLATE NOCASE ASC
            `
        );

    const resultado = [];

    for (const parceiro of parceiros) {

        const produtos =
            await consultarTodos(
                `
                    SELECT *
                    FROM parceiroProdutos
                    WHERE parceiroId = ?
                    ORDER BY ordem ASC, id ASC
                `,
                [
                    parceiro.id
                ]
            );

        resultado.push({
            ...parceiro,
            produtos
        });

    }

    return resultado;

}

// ======================================================
// SALVAR PAINEL DOS PARCEIROS
// ======================================================

async function salvarPainelParceiros({
    canalId,
    mensagemId
}) {

    await executar(
        `
            INSERT INTO painelParceiros (

                id,
                canalId,
                mensagemId,
                ultimaAtualizacao

            )
            VALUES (1, ?, ?, ?)

            ON CONFLICT(id)
            DO UPDATE SET

                canalId =
                    excluded.canalId,

                mensagemId =
                    excluded.mensagemId,

                ultimaAtualizacao =
                    excluded.ultimaAtualizacao
        `,
        [
            canalId,
            mensagemId,
            new Date().toLocaleString(
                "pt-BR"
            )
        ]
    );

}

// ======================================================
// OBTER PAINEL DOS PARCEIROS
// ======================================================

async function obterPainelParceiros() {

    return consultarUm(
        `
            SELECT *
            FROM painelParceiros
            WHERE id = 1
        `
    );

}
// ======================================================
// EDITAR PARCEIRO
// ======================================================

async function editarParceiro(
    parceiroId,
    dados
) {

    const parceiroExistente =
        await buscarParceiro(
            parceiroId
        );

    if (!parceiroExistente) {

        throw new Error(
            "O parceiro informado não foi encontrado."
        );

    }

    if (!dados?.nomeFaccao?.trim()) {

        throw new Error(
            "O nome da facção é obrigatório."
        );

    }

    if (!dados?.categoria?.trim()) {

        throw new Error(
            "A categoria do parceiro é obrigatória."
        );

    }

    if (
        !dados?.responsavel1?.trim() ||
        !dados?.telefone1?.trim()
    ) {

        throw new Error(
            "O primeiro responsável e o telefone são obrigatórios."
        );

    }

    if (
        !Array.isArray(dados.produtos) ||
        dados.produtos.length === 0
    ) {

        throw new Error(
            "Informe pelo menos um produto e valor."
        );

    }

    if (dados.produtos.length > 3) {

        throw new Error(
            "Cada parceiro pode possuir no máximo três produtos."
        );

    }

    await executar(
        "BEGIN IMMEDIATE TRANSACTION"
    );

    try {

        await executar(
            `
                UPDATE parceiros

                SET
                    nomeFaccao = ?,
                    categoria = ?,
                    responsavel1 = ?,
                    telefone1 = ?,
                    responsavel2 = ?,
                    telefone2 = ?,
                    responsavel3 = ?,
                    telefone3 = ?

                WHERE id = ?
            `,
            [
                dados.nomeFaccao.trim(),
                dados.categoria.trim(),
                dados.responsavel1.trim(),
                dados.telefone1.trim(),
                dados.responsavel2?.trim() || null,
                dados.telefone2?.trim() || null,
                dados.responsavel3?.trim() || null,
                dados.telefone3?.trim() || null,
                parceiroId
            ]
        );

        await executar(
            `
                DELETE FROM parceiroProdutos
                WHERE parceiroId = ?
            `,
            [
                parceiroId
            ]
        );

        for (
            let indice = 0;
            indice < dados.produtos.length;
            indice++
        ) {

            const produto =
                dados.produtos[indice];

            if (
                !produto?.nome?.trim() ||
                !produto?.valor?.trim()
            ) {

                throw new Error(
                    `O produto ${indice + 1} precisa possuir nome e valor.`
                );

            }

            await executar(
                `
                    INSERT INTO parceiroProdutos (

                        parceiroId,
                        produto,
                        valor,
                        ordem

                    )
                    VALUES (?, ?, ?, ?)
                `,
                [
                    parceiroId,
                    produto.nome.trim(),
                    produto.valor.trim(),
                    indice + 1
                ]
            );

        }

        await executar(
            "COMMIT"
        );

        return buscarParceiro(
            parceiroId
        );

    } catch (error) {

        await executar(
            "ROLLBACK"
        ).catch(() => {});

        throw error;

    }

}
// ======================================================
// REMOVER PARCEIRO
// ======================================================

async function removerParceiro(
    parceiroId
) {

    const parceiro =
        await buscarParceiro(
            parceiroId
        );

    if (!parceiro) {

        throw new Error(
            "O parceiro informado não foi encontrado."
        );

    }

    await executar(
        "BEGIN IMMEDIATE TRANSACTION"
    );

    try {

        /*
         * Remove primeiro os produtos para funcionar
         * mesmo caso o SQLite não esteja aplicando
         * exclusão automática por chave estrangeira.
         */

        await executar(
            `
                DELETE FROM parceiroProdutos
                WHERE parceiroId = ?
            `,
            [
                parceiroId
            ]
        );

        const resultado =
            await executar(
                `
                    DELETE FROM parceiros
                    WHERE id = ?
                `,
                [
                    parceiroId
                ]
            );

        if (
            resultado.changes === 0
        ) {

            throw new Error(
                "Nenhuma parceria foi removida."
            );

        }

        await executar(
            "COMMIT"
        );

        return parceiro;

    } catch (error) {

        await executar(
            "ROLLBACK"
        ).catch(() => {});

        throw error;

    }

}
// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    salvarParceiro,

    buscarParceiro,

    listarParceiros,

    editarParceiro,

    removerParceiro,

    salvarPainelParceiros,

    obterPainelParceiros

};