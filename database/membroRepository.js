const db = require("./database");

// ======================================================
// BUSCAR MEMBRO PELO DISCORD
// ======================================================

function buscarMembro(discordId) {

    return new Promise((resolve, reject) => {

        db.get(

            `SELECT *
             FROM membros
             WHERE discordId = ?`,

            [discordId],

            (err, row) => {

                if (err) {

                    return reject(err);

                }

                resolve(row);

            }

        );

    });

}

// ======================================================
// ATUALIZAR CARGO
// ======================================================

function atualizarCargo(discordId, cargo) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE membros
             SET cargo = ?
             WHERE discordId = ?`,

            [

                cargo,

                discordId

            ],

            function (err) {

                if (err) return reject(err);

                resolve();

            }

        );

    });

}

// ======================================================
// ATUALIZAR STATUS
// ======================================================

function atualizarStatus(discordId, status) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE membros
             SET status = ?
             WHERE discordId = ?`,

            [

                status,

                discordId

            ],

            function (err) {

                if (err) return reject(err);

                resolve();

            }

        );

    });

}

// ======================================================
// SOMAR ADVERTÊNCIA
// ======================================================

function adicionarAdvertencia(discordId) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE membros

             SET advertencias = advertencias + 1,

                 ultimaAdvertencia = ?

             WHERE discordId = ?`,

            [

                new Date().toLocaleString("pt-BR"),

                discordId

            ],

            function (err) {

                if (err) return reject(err);

                resolve();

            }

        );

    });

}

// ======================================================
// SOMAR PROMOÇÃO
// ======================================================

function adicionarPromocao(discordId) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE membros

             SET promocoes = promocoes + 1,

                 ultimaPromocao = ?

             WHERE discordId = ?`,

            [

                new Date().toLocaleString("pt-BR"),

                discordId

            ],

            function (err) {

                if (err) return reject(err);

                resolve();

            }

        );

    });

}

// ======================================================
// SOMAR REBAIXAMENTO
// ======================================================

function adicionarRebaixamento(discordId) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE membros

             SET rebaixamentos = rebaixamentos + 1

             WHERE discordId = ?`,

            [

                discordId

            ],

            function (err) {

                if (err) return reject(err);

                resolve();

            }

        );

    });

}

module.exports = {

    buscarMembro,

    atualizarCargo,

    atualizarStatus,

    adicionarAdvertencia,

    adicionarPromocao,

    adicionarRebaixamento

};