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
// CADASTRAR / ATUALIZAR AÇÃO NO CATÁLOGO
// ======================================================

async function salvarAcao(dados) {

    if (!dados?.chave?.trim()) {

        throw new Error(
            "A chave da ação é obrigatória."
        );

    }

    if (!dados?.nome?.trim()) {

        throw new Error(
            "O nome da ação é obrigatório."
        );

    }

    if (!dados?.porte?.trim()) {

        throw new Error(
            "O porte da ação é obrigatório."
        );

    }

    const contingente =
        Number(
            dados.contingente
        );

    const reservas =
        Number(
            dados.reservas ?? 2
        );

    if (
        !Number.isInteger(
            contingente
        ) ||
        contingente <= 0
    ) {

        throw new Error(
            "O contingente da ação deve ser um número inteiro maior que zero."
        );

    }

    if (
        !Number.isInteger(
            reservas
        ) ||
        reservas < 0
    ) {

        throw new Error(
            "A quantidade de reservas não pode ser negativa."
        );

    }

    await executar(
        `
            INSERT INTO acoes (

                chave,
                nome,
                porte,
                contingente,
                reservas,
                armamento,
                resumoRegras,
                imagemPerimetro,
                ativo

            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

            ON CONFLICT(chave)
            DO UPDATE SET

                nome =
                    excluded.nome,

                porte =
                    excluded.porte,

                contingente =
                    excluded.contingente,

                reservas =
                    excluded.reservas,

                armamento =
                    excluded.armamento,

                resumoRegras =
                    excluded.resumoRegras,

                imagemPerimetro =
                    excluded.imagemPerimetro,

                ativo =
                    excluded.ativo
        `,
        [
            dados.chave.trim(),
            dados.nome.trim(),
            dados.porte.trim(),
            contingente,
            reservas,
            dados.armamento?.trim() || null,
            dados.resumoRegras?.trim() || null,
            dados.imagemPerimetro?.trim() || null,
            dados.ativo === false
                ? 0
                : 1
        ]
    );

    return buscarAcaoPorChave(
        dados.chave
    );

}

// ======================================================
// BUSCAR AÇÃO POR ID
// ======================================================

async function buscarAcao(
    acaoId
) {

    return consultarUm(
        `
            SELECT *
            FROM acoes
            WHERE id = ?
        `,
        [
            acaoId
        ]
    );

}

// ======================================================
// BUSCAR AÇÃO POR CHAVE
// ======================================================

async function buscarAcaoPorChave(
    chave
) {

    return consultarUm(
        `
            SELECT *
            FROM acoes
            WHERE chave = ?
        `,
        [
            chave
        ]
    );

}

// ======================================================
// LISTAR AÇÕES ATIVAS
// ======================================================

async function listarAcoesAtivas() {

    return consultarTodos(
        `
            SELECT *
            FROM acoes

            WHERE ativo = 1

            ORDER BY
                CASE porte

                    WHEN 'Pequeno'
                        THEN 1

                    WHEN 'Médio'
                        THEN 2

                    WHEN 'Medio'
                        THEN 2

                    WHEN 'Grande'
                        THEN 3

                    ELSE 4

                END,

                nome COLLATE NOCASE ASC
        `
    );

}

// ======================================================
// CRIAR AÇÃO MARCADA
// ======================================================

async function criarAcaoMarcada({
    acaoId,
    criadoPorId,
    criadoPorNome
}) {

    const acao =
        await buscarAcao(
            acaoId
        );

    if (!acao) {

        throw new Error(
            "A ação selecionada não foi encontrada."
        );

    }

    if (
        Number(acao.ativo) !== 1
    ) {

        throw new Error(
            "Essa ação está desativada."
        );

    }

    const resultado =
        await executar(
            `
                INSERT INTO acoesMarcadas (

                    acaoId,
                    status,
                    criadoPorId,
                    criadoPorNome,
                    criadoEm

                )
                VALUES (?, ?, ?, ?, ?)
            `,
            [
                acao.id,
                "Aberta",
                criadoPorId,
                criadoPorNome,
                new Date().toLocaleString(
                    "pt-BR"
                )
            ]
        );

    return buscarAcaoMarcada(
        resultado.lastID
    );

}

// ======================================================
// BUSCAR AÇÃO MARCADA
// ======================================================

async function buscarAcaoMarcada(
    acaoMarcadaId
) {

    return consultarUm(
        `
            SELECT

                am.*,

                a.chave,
                a.nome AS nomeAcao,
                a.porte,
                a.contingente,
                a.reservas,
                a.armamento,
                a.resumoRegras,
                a.imagemPerimetro

            FROM acoesMarcadas am

            INNER JOIN acoes a
                ON a.id = am.acaoId

            WHERE am.id = ?
        `,
        [
            acaoMarcadaId
        ]
    );

}

// ======================================================
// SALVAR MENSAGEM DA AÇÃO MARCADA
// ======================================================

async function salvarMensagemAcaoMarcada({
    acaoMarcadaId,
    canalId,
    mensagemId
}) {

    await executar(
        `
            UPDATE acoesMarcadas

            SET
                canalId = ?,
                mensagemId = ?

            WHERE id = ?
        `,
        [
            canalId,
            mensagemId,
            acaoMarcadaId
        ]
    );

}

// ======================================================
// LISTAR PARTICIPANTES
// ======================================================

async function listarParticipantes(
    acaoMarcadaId
) {

    return consultarTodos(
        `
            SELECT *
            FROM acoesParticipantes

            WHERE acaoMarcadaId = ?

            ORDER BY ordem ASC
        `,
        [
            acaoMarcadaId
        ]
    );

}

// ======================================================
// ADICIONAR PARTICIPANTE
// ======================================================

async function adicionarParticipanteAcao({
    acaoMarcadaId,
    discordId,
    nome
}) {

    const acao =
        await buscarAcaoMarcada(
            acaoMarcadaId
        );

    if (!acao) {

        throw new Error(
            "A ação marcada não foi encontrada."
        );

    }

    if (
        acao.status !==
        "Aberta"
    ) {

        return {
            status:
                "encerrada"
        };

    }

    const existente =
        await consultarUm(
            `
                SELECT *
                FROM acoesParticipantes

                WHERE acaoMarcadaId = ?
                AND discordId = ?
            `,
            [
                acaoMarcadaId,
                discordId
            ]
        );

    if (existente) {

        return {
            status:
                "ja_inscrito",

            participante:
                existente
        };

    }

    const participantes =
        await listarParticipantes(
            acaoMarcadaId
        );

    const limiteTitulares =
        Number(
            acao.contingente
        );

    const limiteReservas =
        Number(
            acao.reservas
        );

    const limiteTotal =
        limiteTitulares +
        limiteReservas;

    if (
        participantes.length >=
        limiteTotal
    ) {

        return {
            status:
                "lotado"
        };

    }

    const ordem =
        participantes.length + 1;

    const tipo =
        ordem <= limiteTitulares
            ? "Titular"
            : "Reserva";

    const resultado =
        await executar(
            `
                INSERT INTO acoesParticipantes (

                    acaoMarcadaId,
                    discordId,
                    nome,
                    ordem,
                    tipo,
                    participou

                )
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                acaoMarcadaId,
                discordId,
                nome,
                ordem,
                tipo,
                tipo === "Titular"
                    ? 1
                    : 0
            ]
        );

    const participante =
        await consultarUm(
            `
                SELECT *
                FROM acoesParticipantes
                WHERE id = ?
            `,
            [
                resultado.lastID
            ]
        );

    return {

        status:
            tipo === "Titular"
                ? "titular"
                : "reserva",

        ordem,

        participante

    };

}

// ======================================================
// REMOVER PARTICIPANTE
// ======================================================

async function removerParticipanteAcao(
    acaoMarcadaId,
    discordId
) {

    const participante =
        await consultarUm(
            `
                SELECT *
                FROM acoesParticipantes

                WHERE acaoMarcadaId = ?
                AND discordId = ?
            `,
            [
                acaoMarcadaId,
                discordId
            ]
        );

    if (!participante) {

        return {
            status:
                "nao_inscrito"
        };

    }

    await executar(
        `
            DELETE FROM acoesParticipantes

            WHERE acaoMarcadaId = ?
            AND discordId = ?
        `,
        [
            acaoMarcadaId,
            discordId
        ]
    );

    // ==================================================
    // REORGANIZAR FILA
    // ==================================================

    const participantes =
        await listarParticipantes(
            acaoMarcadaId
        );

    const acao =
        await buscarAcaoMarcada(
            acaoMarcadaId
        );

    for (
        let indice = 0;
        indice <
        participantes.length;
        indice++
    ) {

        const ordem =
            indice + 1;

        const tipo =
            ordem <=
            Number(
                acao.contingente
            )
                ? "Titular"
                : "Reserva";

        await executar(
            `
                UPDATE acoesParticipantes

                SET
                    ordem = ?,
                    tipo = ?,
                    participou = ?

                WHERE id = ?
            `,
            [
                ordem,
                tipo,
                tipo === "Titular"
                    ? 1
                    : 0,
                participantes[indice].id
            ]
        );

    }

    return {
        status:
            "removido"
    };

}

// ======================================================
// LISTAR AÇÕES MARCADAS ABERTAS
// ======================================================

async function listarAcoesMarcadasAbertas() {

    return consultarTodos(
        `
            SELECT

                am.*,

                a.nome AS nomeAcao,
                a.porte,
                a.contingente,
                a.reservas

            FROM acoesMarcadas am

            INNER JOIN acoes a
                ON a.id = am.acaoId

            WHERE am.status = 'Aberta'

            ORDER BY am.id DESC
        `
    );

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    salvarAcao,

    buscarAcao,

    buscarAcaoPorChave,

    listarAcoesAtivas,

    criarAcaoMarcada,

    buscarAcaoMarcada,

    salvarMensagemAcaoMarcada,

    listarParticipantes,

    adicionarParticipanteAcao,

    removerParticipanteAcao,

    listarAcoesMarcadasAbertas

};