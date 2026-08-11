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
// RESET COMPLETO DA TEMPORADA
// ======================================================

async function resetarTemporadaAcoes() {

    await executar(
        "BEGIN TRANSACTION"
    );

    try {

        // ==================================================
        // APAGAR KILLS DAS AÇÕES FINALIZADAS
        // ==================================================

        await executar(`
            DELETE FROM acoesKills

            WHERE acaoMarcadaId IN (

                SELECT id
                FROM acoesMarcadas
                WHERE status = 'Finalizada'

            )
        `);

        // ==================================================
        // APAGAR RESULTADOS
        // ==================================================

        await executar(`
            DELETE FROM acoesResultados

            WHERE acaoMarcadaId IN (

                SELECT id
                FROM acoesMarcadas
                WHERE status = 'Finalizada'

            )
        `);

        // ==================================================
        // APAGAR PARTICIPANTES DO HISTÓRICO
        // ==================================================

        await executar(`
            DELETE FROM acoesParticipantes

            WHERE acaoMarcadaId IN (

                SELECT id
                FROM acoesMarcadas
                WHERE status = 'Finalizada'

            )
        `);

        // ==================================================
        // APAGAR AÇÕES FINALIZADAS
        // ==================================================

        const resultado =
            await executar(`
                DELETE FROM acoesMarcadas
                WHERE status = 'Finalizada'
            `);

        await executar(
            "COMMIT"
        );

        return {

            sucesso:
                true,

            acoesApagadas:
                resultado.changes || 0

        };

    } catch (error) {

        await executar(
            "ROLLBACK"
        ).catch(() => {});

        throw error;

    }

}

module.exports = {
    resetarTemporadaAcoes
};