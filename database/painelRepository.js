const db = require("./database");

function salvarPainel(nome, canalId, mensagemId) {

    db.run(

        `INSERT OR REPLACE INTO paineis
        VALUES(?,?,?)`,

        [

            nome,

            canalId,

            mensagemId

        ]

    );

}

function buscarPainel(nome) {

    return new Promise((resolve,reject)=>{

        db.get(

            "SELECT * FROM paineis WHERE nome=?",

            [nome],

            (err,row)=>{

                if(err) reject(err);

                else resolve(row);

            }

        );

    });

}

module.exports={

    salvarPainel,

    buscarPainel

};