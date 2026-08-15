const db =
    require("../database/database");

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
                (
                    error,
                    row
                ) => {

                    if (error) {

                        return reject(
                            error
                        );

                    }

                    resolve(
                        row || null
                    );

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
                (
                    error,
                    rows
                ) => {

                    if (error) {

                        return reject(
                            error
                        );

                    }

                    resolve(
                        rows || []
                    );

                }
            );

        }
    );

}

// ======================================================
// VALIDAR PARCEIRO
// ======================================================

function validarParceiro(
    dados
) {

    if (
        !dados?.nomeFaccao?.trim()
    ) {

        throw new Error(
            "O nome da FAC é obrigatório."
        );

    }

    if (
        !dados?.produto?.trim()
    ) {

        throw new Error(
            "O produto é obrigatório."
        );

    }

    if (
        !dados?.descricao?.trim()
    ) {

        throw new Error(
            "A descrição é obrigatória."
        );

    }

    if (
        dados.descricao.trim().length >
        4000
    ) {

        throw new Error(
            "A descrição pode possuir no máximo 4.000 caracteres."
        );

    }

    if (
        !dados?.salaDarkChat?.trim()
    ) {

        throw new Error(
            "A sala do Dark Chat é obrigatória."
        );

    }

    if (
        !dados?.senhaSala?.trim()
    ) {

        throw new Error(
            "A senha da sala é obrigatória."
        );

    }

}

// ======================================================
// SALVAR PARCEIRO
// ======================================================

async function salvarParceiro(
    dados
) {

    validarParceiro(
        dados
    );

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
                dados.nomeFaccao.trim(),

                dados.produto.trim(),

                dados.descricao.trim(),

                dados.salaDarkChat.trim(),

                dados.senhaSala.trim(),

                dados.criadoPor || null,

                dados.dataCriacao ||
                    new Date()
                        .toLocaleString(
                            "pt-BR"
                        ),

                // Compatibilidade com banco antigo.
                // Estes dados NÃO são mais coletados.

                "",

                "",

                ""
            ]
        );

    return buscarParceiro(
        resultado.lastID
    );

}

// ======================================================
// BUSCAR PARCEIRO
// ======================================================

async function buscarParceiro(
    parceiroId
) {

    return consultarUm(
        `
            SELECT

                id,

                nomeFaccao,

                produto,

                descricao,

                salaDarkChat,

                senhaSala,

                criadoPor,

                dataCriacao

            FROM parceiros

            WHERE id = ?
        `,
        [
            parceiroId
        ]
    );

}

// ======================================================
// LISTAR PARCEIROS
// ======================================================

async function listarParceiros() {

    return consultarTodos(
        `
            SELECT

                id,

                nomeFaccao,

                produto,

                descricao,

                salaDarkChat,

                senhaSala,

                criadoPor,

                dataCriacao

            FROM parceiros

            ORDER BY
                nomeFaccao COLLATE NOCASE ASC
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

    if (
        !parceiroExistente
    ) {

        throw new Error(
            "O parceiro informado não foi encontrado."
        );

    }

    validarParceiro(
        dados
    );

    const resultado =
        await executar(
            `
                UPDATE parceiros

                SET
                    nomeFaccao = ?,

                    produto = ?,

                    descricao = ?,

                    salaDarkChat = ?,

                    senhaSala = ?

                WHERE id = ?
            `,
            [
                dados.nomeFaccao.trim(),

                dados.produto.trim(),

                dados.descricao.trim(),

                dados.salaDarkChat.trim(),

                dados.senhaSala.trim(),

                parceiroId
            ]
        );

    if (
        resultado.changes === 0
    ) {

        throw new Error(
            "Nenhuma parceria foi alterada."
        );

    }

    return buscarParceiro(
        parceiroId
    );

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

    if (
        !parceiro
    ) {

        throw new Error(
            "O parceiro informado não foi encontrado."
        );

    }

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

    return parceiro;

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
            INSERT INTO painelParceiros
            (
                id,

                canalId,

                mensagemId,

                ultimaAtualizacao
            )

            VALUES (
                1,
                ?,
                ?,
                ?
            )

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

            new Date()
                .toLocaleString(
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