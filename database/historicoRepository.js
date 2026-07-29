const db = require("./database");

function contarHistorico(discordId, tipo) {

    return new Promise((resolve, reject) => {

        db.get(

            "SELECT COUNT(*) AS total FROM historico WHERE discordId = ? AND tipo = ?",

            [discordId, tipo],

            (err, row) => {

                if (err) return reject(err);

                resolve(row.total);

            }

        );

    });

}

module.exports = {

    contarHistorico

};