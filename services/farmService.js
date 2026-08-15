const db = require("../database/database");

// ======================================================
// METAS
// ======================================================

const META_DADOS_DIARIA = 350;
const META_DADOS_SEMANAL = 1750;
const META_DINHEIRO_SUJO_SEMANAL = 500000;

// ======================================================
// AUXILIARES DE DATA
// ======================================================

function formatarDataISO(data) {

    const ano = data.getFullYear();

    const mes = String(
        data.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        data.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}

function obterInicioSemana(data = new Date()) {

    const copia = new Date(data);

    const diaSemana = copia.getDay();

    const diferenca =
        diaSemana === 0
            ? -6
            : 1 - diaSemana;

    copia.setDate(
        copia.getDate() + diferenca
    );

    copia.setHours(
        0,
        0,
        0,
        0
    );

    return formatarDataISO(copia);

}

function obterDataDia(data = new Date()) {

    return formatarDataISO(data);

}

function obterDataRegistro(data = new Date()) {

    return data.toLocaleString("pt-BR");

}

// ======================================================
// EXECUTAR SQL
// ======================================================

function executar(sql, parametros = []) {

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

function consultarUm(sql, parametros = []) {

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

function consultarTodos(sql, parametros = []) {

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
// VALIDAR QUANTIDADE
// ======================================================

function normalizarQuantidade(valor) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {

        return 0;

    }

    const numero = Number(
        String(valor)
            .replace(/\./g, "")
            .replace(",", ".")
    );

    if (
        !Number.isFinite(numero) ||
        numero < 0 ||
        !Number.isInteger(numero)
    ) {

        throw new Error(
            "Informe somente números inteiros positivos."
        );

    }

    return numero;

}



// ======================================================
// REGISTRAR LANÇAMENTO
// ======================================================

async function registrarFarm({
    discordId,
    tijolos,
    materiais
}) {

    // ==================================================
    // INTERNAMENTE:
    // tijolos = Dados
    // materiais = Dinheiro Sujo
    // ==================================================

    const quantidadeDados =
        normalizarQuantidade(
            tijolos
        );

    const quantidadeDinheiroSujo =
        normalizarQuantidade(
            materiais
        );

    if (
        quantidadeDados === 0 &&
        quantidadeDinheiroSujo === 0
    ) {

        throw new Error(
            "Informe ao menos uma quantidade de Dados ou Dinheiro Sujo."
        );

    }

    const agora =
        new Date();

    const dataRegistro =
        obterDataRegistro(
            agora
        );

    const dataDia =
        obterDataDia(
            agora
        );

    const semanaInicio =
        obterInicioSemana(
            agora
        );

    await executar(
        `
            INSERT INTO farmRegistros
            (
                discordId,
                tijolos,
                materiais,
                dataRegistro,
                dataDia,
                semanaInicio
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            discordId,
            quantidadeDados,
            quantidadeDinheiroSujo,
            dataRegistro,
            dataDia,
            semanaInicio
        ]
    );

    return obterResumoMembro(
        discordId
    );

}

// ======================================================
// OBTER RESUMO DO MEMBRO
// ======================================================

async function obterResumoMembro(
    discordId,
    data = new Date()
) {

    const semanaInicio =
        obterInicioSemana(
            data
        );

    const dataDia =
        obterDataDia(
            data
        );

    // ==================================================
    // TOTAIS DA SEMANA
    // ==================================================

    const totaisSemana =
        await consultarUm(
            `
                SELECT
                    COALESCE(
                        SUM(tijolos),
                        0
                    ) AS dadosSemana,

                    COALESCE(
                        SUM(materiais),
                        0
                    ) AS dinheiroSujoSemana

                FROM farmRegistros

                WHERE discordId = ?
                AND semanaInicio = ?
            `,
            [
                discordId,
                semanaInicio
            ]
        );

    // ==================================================
    // TOTAL DE DADOS DO DIA
    // ==================================================

    const totaisDia =
        await consultarUm(
            `
                SELECT
                    COALESCE(
                        SUM(tijolos),
                        0
                    ) AS dadosDia

                FROM farmRegistros

                WHERE discordId = ?
                AND dataDia = ?
            `,
            [
                discordId,
                dataDia
            ]
        );

    // ==================================================
    // ÚLTIMO REGISTRO
    // ==================================================

    const ultimoRegistro =
        await consultarUm(
            `
                SELECT
                    dataRegistro

                FROM farmRegistros

                WHERE discordId = ?

                ORDER BY id DESC

                LIMIT 1
            `,
            [
                discordId
            ]
        );

    // ==================================================
    // CONVERTER TOTAIS
    // ==================================================

    const dadosSemana =
        Number(
            totaisSemana?.dadosSemana || 0
        );

    const dadosDia =
        Number(
            totaisDia?.dadosDia || 0
        );

    const dinheiroSujoSemana =
        Number(
            totaisSemana?.dinheiroSujoSemana || 0
        );

    // ==================================================
    // META DIÁRIA DE DADOS
    // ==================================================

    const excedenteDadosDia =
        Math.max(
            0,
            dadosDia -
            META_DADOS_DIARIA
        );

    const faltamDadosDia =
        Math.max(
            0,
            META_DADOS_DIARIA -
            dadosDia
        );

    // ==================================================
    // META SEMANAL DE DADOS
    // ==================================================

    const excedenteDadosSemana =
        Math.max(
            0,
            dadosSemana -
            META_DADOS_SEMANAL
        );

    const faltamDadosSemana =
        Math.max(
            0,
            META_DADOS_SEMANAL -
            dadosSemana
        );

    // ==================================================
    // META SEMANAL DE DINHEIRO SUJO
    // ==================================================

    const excedenteDinheiroSujoSemana =
        Math.max(
            0,
            dinheiroSujoSemana -
            META_DINHEIRO_SUJO_SEMANAL
        );

    const faltamDinheiroSujoSemana =
        Math.max(
            0,
            META_DINHEIRO_SUJO_SEMANAL -
            dinheiroSujoSemana
        );

    return {

        discordId,

        semanaInicio,

        dataDia,

        dadosDia,

        dadosSemana,

        dinheiroSujoSemana,

        metaDadosDiaria:
            META_DADOS_DIARIA,

        metaDadosSemanal:
            META_DADOS_SEMANAL,

        metaDinheiroSujoSemanal:
            META_DINHEIRO_SUJO_SEMANAL,

        excedenteDadosDia,

        faltamDadosDia,

        excedenteDadosSemana,

        faltamDadosSemana,

        excedenteDinheiroSujoSemana,

        faltamDinheiroSujoSemana,

        ultimaAtualizacao:
            ultimoRegistro?.dataRegistro ||
            "Nenhum registro realizado"

    };

}

// ======================================================
// SALVAR CANAL E MENSAGEM DO MEMBRO
// ======================================================

async function salvarPainelMembro({
    discordId,
    nomeExibicao,
    canalId,
    mensagemId
}) {

    await executar(
        `
            INSERT INTO farmMembros
            (
                discordId,
                nomeExibicao,
                canalId,
                mensagemId,
                ultimaAtualizacao
            )
            VALUES (?, ?, ?, ?, ?)

            ON CONFLICT(discordId)
            DO UPDATE SET
                nomeExibicao = excluded.nomeExibicao,
                canalId = excluded.canalId,
                mensagemId = excluded.mensagemId,
                ultimaAtualizacao =
                    excluded.ultimaAtualizacao
        `,
        [
            discordId,
            nomeExibicao,
            canalId,
            mensagemId,
            obterDataRegistro()
        ]
    );

}

// ======================================================
// OBTER PAINEL DO MEMBRO
// ======================================================

async function obterPainelMembro(
    discordId
) {

    return consultarUm(
        `
            SELECT *
            FROM farmMembros
            WHERE discordId = ?
        `,
        [
            discordId
        ]
    );

}

// ======================================================
// ATUALIZAR DATA DO PAINEL
// ======================================================

async function atualizarDataPainel(
    discordId
) {

    await executar(
        `
            UPDATE farmMembros
            SET ultimaAtualizacao = ?
            WHERE discordId = ?
        `,
        [
            obterDataRegistro(),
            discordId
        ]
    );

}

// ======================================================
// RELATÓRIO SEMANAL
// ======================================================

async function obterRelatorioSemanal(
    data = new Date()
) {

    const semanaInicio =
        obterInicioSemana(data);

    return consultarTodos(
    `
        SELECT
            fr.discordId,

            fm.nomeExibicao,

            COALESCE(
                SUM(fr.tijolos),
                0
            ) AS dados,

            COALESCE(
                SUM(fr.materiais),
                0
            ) AS dinheiroSujo

        FROM farmRegistros fr

        LEFT JOIN farmMembros fm
            ON fm.discordId =
               fr.discordId

        WHERE fr.semanaInicio = ?

        GROUP BY
            fr.discordId,
            fm.nomeExibicao

        ORDER BY
            dados DESC,
            dinheiroSujo DESC
    `,
    [
        semanaInicio
    ]
);

}

// ======================================================
// RESETAR UM MEMBRO
// ======================================================

async function resetarMembro(
    discordId
) {

    const resultado =
        await executar(
            `
                DELETE FROM farmRegistros
                WHERE discordId = ?
            `,
            [
                discordId
            ]
        );

    return resultado.changes > 0;

}

// ======================================================
// RESETAR TODOS
// ======================================================

async function resetarTodos() {

    const resultado =
        await executar(
            `
                DELETE FROM farmRegistros
            `
        );

    return resultado.changes;

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {

    META_DADOS_DIARIA,
    META_DADOS_SEMANAL,
    META_DINHEIRO_SUJO_SEMANAL,

    obterInicioSemana,
    obterDataDia,

    registrarFarm,
    obterResumoMembro,

    salvarPainelMembro,
    obterPainelMembro,
    atualizarDataPainel,

    obterRelatorioSemanal,

    resetarMembro,
    resetarTodos

};