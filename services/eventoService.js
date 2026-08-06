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
// SALVAR EVENTO
// ======================================================

async function salvarEvento(dados) {

    if (!dados?.mensagemId) {

        throw new Error(
            "O ID da mensagem do evento não foi informado."
        );

    }

    const quantidadeAuxiliares =
        Number(
            dados.quantidadeAuxiliares
        );

    if (
        !Number.isInteger(
            quantidadeAuxiliares
        ) ||
        quantidadeAuxiliares < 1
    ) {

        throw new Error(
            "A quantidade de auxiliares precisa ser um número inteiro maior que zero."
        );

    }

    await executar(
        `
            INSERT INTO eventos (

                mensagemId,
                nome,
                descricao,
                dataHora,
                traje,
                responsavel,
                quantidadeAuxiliares,
                flyer,
                criadoPor,
                dataCriacao

            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            ON CONFLICT(mensagemId)
            DO UPDATE SET

                nome = excluded.nome,
                descricao = excluded.descricao,
                dataHora = excluded.dataHora,
                traje = excluded.traje,
                responsavel = excluded.responsavel,
                quantidadeAuxiliares =
                    excluded.quantidadeAuxiliares,
                flyer = excluded.flyer,
                criadoPor = excluded.criadoPor
        `,
        [
            dados.mensagemId,
            dados.nome,
            dados.descricao,
            dados.dataHora,
            dados.traje,
            dados.responsavel,
            quantidadeAuxiliares,
            dados.flyer || null,
            dados.criadoPor,
            dados.dataCriacao ||
                new Date().toLocaleString(
                    "pt-BR"
                )
        ]
    );

    return buscarEvento(
        dados.mensagemId
    );

}

// ======================================================
// BUSCAR EVENTO
// ======================================================

async function buscarEvento(
    mensagemId
) {

    if (!mensagemId) {

        return null;

    }

    return consultarUm(
        `
            SELECT *
            FROM eventos
            WHERE mensagemId = ?
        `,
        [
            mensagemId
        ]
    );

}

// ======================================================
// VERIFICAR PARTICIPAÇÃO
// ======================================================

async function verificarParticipante(
    mensagemId,
    discordId
) {

    if (
        !mensagemId ||
        !discordId
    ) {

        return null;

    }

    return consultarUm(
        `
            SELECT *
            FROM eventoParticipantes
            WHERE mensagemId = ?
              AND discordId = ?
        `,
        [
            mensagemId,
            discordId
        ]
    );

}

// ======================================================
// LISTAR PARTICIPANTES
// ======================================================

async function listarParticipantes(
    mensagemId
) {

    const evento =
        await buscarEvento(
            mensagemId
        );

    if (!evento) {

        return {

            evento: null,

            todos: [],

            auxiliares: [],

            reservas: [],

            limiteAuxiliares: 0,

            limiteReservas: 2,

            limiteTotal: 0

        };

    }

    const todos =
        await consultarTodos(
            `
                SELECT *
                FROM eventoParticipantes
                WHERE mensagemId = ?
                ORDER BY ordem ASC, id ASC
            `,
            [
                mensagemId
            ]
        );

    const limiteAuxiliares =
        Number(
            evento.quantidadeAuxiliares ||
            0
        );

    const limiteReservas = 2;

    const auxiliares =
        todos.slice(
            0,
            limiteAuxiliares
        );

    const reservas =
        todos.slice(
            limiteAuxiliares,
            limiteAuxiliares +
                limiteReservas
        );

    return {

        evento,

        todos,

        auxiliares,

        reservas,

        limiteAuxiliares,

        limiteReservas,

        limiteTotal:
            limiteAuxiliares +
            limiteReservas

    };

}

// ======================================================
// ADICIONAR PARTICIPANTE
// ======================================================

function adicionarParticipante({
    mensagemId,
    discordId,
    nome
}) {

    return new Promise(
        (resolve, reject) => {

            db.serialize(() => {

                db.run(
                    "BEGIN IMMEDIATE TRANSACTION",
                    errorInicio => {

                        if (errorInicio) {

                            return reject(
                                errorInicio
                            );

                        }

                        db.get(
                            `
                                SELECT *
                                FROM eventos
                                WHERE mensagemId = ?
                            `,
                            [
                                mensagemId
                            ],
                            (
                                erroEvento,
                                evento
                            ) => {

                                if (
                                    erroEvento ||
                                    !evento
                                ) {

                                    return db.run(
                                        "ROLLBACK",
                                        () => {

                                            reject(
                                                erroEvento ||
                                                new Error(
                                                    "O evento não foi encontrado."
                                                )
                                            );

                                        }
                                    );

                                }

                                db.get(
                                    `
                                        SELECT *
                                        FROM eventoParticipantes
                                        WHERE mensagemId = ?
                                          AND discordId = ?
                                    `,
                                    [
                                        mensagemId,
                                        discordId
                                    ],
                                    (
                                        erroExistente,
                                        existente
                                    ) => {

                                        if (
                                            erroExistente
                                        ) {

                                            return db.run(
                                                "ROLLBACK",
                                                () => {

                                                    reject(
                                                        erroExistente
                                                    );

                                                }
                                            );

                                        }

                                        if (existente) {

                                            return db.run(
                                                "ROLLBACK",
                                                () => {

                                                    resolve({

                                                        status:
                                                            "ja_inscrito",

                                                        participante:
                                                            existente

                                                    });

                                                }
                                            );

                                        }

                                        db.get(
                                            `
                                                SELECT COUNT(*) AS total
                                                FROM eventoParticipantes
                                                WHERE mensagemId = ?
                                            `,
                                            [
                                                mensagemId
                                            ],
                                            (
                                                erroContagem,
                                                resultado
                                            ) => {

                                                if (
                                                    erroContagem
                                                ) {

                                                    return db.run(
                                                        "ROLLBACK",
                                                        () => {

                                                            reject(
                                                                erroContagem
                                                            );

                                                        }
                                                    );

                                                }

                                                const totalAtual =
                                                    Number(
                                                        resultado?.total ||
                                                        0
                                                    );

                                                const limiteAuxiliares =
                                                    Number(
                                                        evento
                                                            .quantidadeAuxiliares ||
                                                        0
                                                    );

                                                const limiteTotal =
                                                    limiteAuxiliares +
                                                    2;

                                                if (
                                                    totalAtual >=
                                                    limiteTotal
                                                ) {

                                                    return db.run(
                                                        "ROLLBACK",
                                                        () => {

                                                            resolve({

                                                                status:
                                                                    "lotado",

                                                                total:
                                                                    totalAtual,

                                                                limiteTotal

                                                            });

                                                        }
                                                    );

                                                }

                                                const ordem =
                                                    totalAtual +
                                                    1;

                                                db.run(
                                                    `
                                                        INSERT INTO eventoParticipantes (

                                                            mensagemId,
                                                            discordId,
                                                            nome,
                                                            ordem

                                                        )
                                                        VALUES (?, ?, ?, ?)
                                                    `,
                                                    [
                                                        mensagemId,
                                                        discordId,
                                                        nome,
                                                        ordem
                                                    ],
                                                    function (
                                                        erroInsercao
                                                    ) {

                                                        if (
                                                            erroInsercao
                                                        ) {

                                                            return db.run(
                                                                "ROLLBACK",
                                                                () => {

                                                                    reject(
                                                                        erroInsercao
                                                                    );

                                                                }
                                                            );

                                                        }

                                                        const id =
                                                            this.lastID;

                                                        db.run(
                                                            "COMMIT",
                                                            erroCommit => {

                                                                if (
                                                                    erroCommit
                                                                ) {

                                                                    return reject(
                                                                        erroCommit
                                                                    );

                                                                }

                                                                resolve({

                                                                    status:
                                                                        ordem <=
                                                                        limiteAuxiliares
                                                                            ? "auxiliar"
                                                                            : "reserva",

                                                                    participante: {

                                                                        id,

                                                                        mensagemId,

                                                                        discordId,

                                                                        nome,

                                                                        ordem

                                                                    },

                                                                    ordem,

                                                                    limiteAuxiliares,

                                                                    limiteTotal

                                                                });

                                                            }
                                                        );

                                                    }
                                                );

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            });

        }
    );

}

// ======================================================
// REMOVER PARTICIPANTE
// ======================================================

function removerParticipante(
    mensagemId,
    discordId
) {

    return new Promise(
        (resolve, reject) => {

            db.serialize(() => {

                db.run(
                    "BEGIN IMMEDIATE TRANSACTION",
                    errorInicio => {

                        if (errorInicio) {

                            return reject(
                                errorInicio
                            );

                        }

                        db.get(
                            `
                                SELECT *
                                FROM eventoParticipantes
                                WHERE mensagemId = ?
                                  AND discordId = ?
                            `,
                            [
                                mensagemId,
                                discordId
                            ],
                            (
                                erroParticipante,
                                participante
                            ) => {

                                if (
                                    erroParticipante
                                ) {

                                    return db.run(
                                        "ROLLBACK",
                                        () => {

                                            reject(
                                                erroParticipante
                                            );

                                        }
                                    );

                                }

                                if (!participante) {

                                    return db.run(
                                        "ROLLBACK",
                                        () => {

                                            resolve({

                                                status:
                                                    "nao_inscrito"

                                            });

                                        }
                                    );

                                }

                                db.run(
                                    `
                                        DELETE FROM eventoParticipantes
                                        WHERE mensagemId = ?
                                          AND discordId = ?
                                    `,
                                    [
                                        mensagemId,
                                        discordId
                                    ],
                                    erroRemocao => {

                                        if (
                                            erroRemocao
                                        ) {

                                            return db.run(
                                                "ROLLBACK",
                                                () => {

                                                    reject(
                                                        erroRemocao
                                                    );

                                                }
                                            );

                                        }

                                        db.all(
                                            `
                                                SELECT *
                                                FROM eventoParticipantes
                                                WHERE mensagemId = ?
                                                ORDER BY ordem ASC, id ASC
                                            `,
                                            [
                                                mensagemId
                                            ],
                                            (
                                                erroLista,
                                                participantes
                                            ) => {

                                                if (
                                                    erroLista
                                                ) {

                                                    return db.run(
                                                        "ROLLBACK",
                                                        () => {

                                                            reject(
                                                                erroLista
                                                            );

                                                        }
                                                    );

                                                }

                                                const lista =
                                                    participantes ||
                                                    [];

                                                function atualizarOrdem(
                                                    indice
                                                ) {

                                                    if (
                                                        indice >=
                                                        lista.length
                                                    ) {

                                                        return db.run(
                                                            "COMMIT",
                                                            erroCommit => {

                                                                if (
                                                                    erroCommit
                                                                ) {

                                                                    return reject(
                                                                        erroCommit
                                                                    );

                                                                }

                                                                resolve({

                                                                    status:
                                                                        "removido",

                                                                    participante,

                                                                    total:
                                                                        lista.length

                                                                });

                                                            }
                                                        );

                                                    }

                                                    const item =
                                                        lista[indice];

                                                    db.run(
                                                        `
                                                            UPDATE eventoParticipantes
                                                            SET ordem = ?
                                                            WHERE id = ?
                                                        `,
                                                        [
                                                            indice +
                                                                1,

                                                            item.id
                                                        ],
                                                        erroAtualizacao => {

                                                            if (
                                                                erroAtualizacao
                                                            ) {

                                                                return db.run(
                                                                    "ROLLBACK",
                                                                    () => {

                                                                        reject(
                                                                            erroAtualizacao
                                                                        );

                                                                    }
                                                                );

                                                            }

                                                            atualizarOrdem(
                                                                indice +
                                                                1
                                                            );

                                                        }
                                                    );

                                                }

                                                atualizarOrdem(
                                                    0
                                                );

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            });

        }
    );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    salvarEvento,

    buscarEvento,

    listarParticipantes,

    verificarParticipante,

    adicionarParticipante,

    removerParticipante

};