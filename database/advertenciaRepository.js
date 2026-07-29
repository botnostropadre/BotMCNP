const db = require("./database");

function contarAdvertencias(discordId) {

    return new Promise((resolve, reject) => {

        db.get(

            "SELECT COUNT(*) AS total FROM advertencias WHERE discordId = ?",

            [discordId],

            (err, row) => {

                if (err) return reject(err);

                resolve(row.total);

            }

        );

    });

}

module.exports = {

    contarAdvertencias

};