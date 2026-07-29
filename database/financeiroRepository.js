const db = require("./database");

function adicionarMovimento(tipo, categoria, valor, descricao, autor) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO financeiro
            (tipo, categoria, valor, descricao, autor, data)
            VALUES (?, ?, ?, ?, ?, ?)`,

            [

                tipo,

                categoria,

                valor,

                descricao,

                autor,

                new Date().toLocaleString("pt-BR")

            ],

            function(err){

                if(err) reject(err);

                else resolve(this.lastID);

            }

        );

    });

}

function listarMovimentos(){

    return new Promise((resolve,reject)=>{

        db.all(

            "SELECT * FROM financeiro ORDER BY id DESC",

            (err,rows)=>{

                if(err) reject(err);

                else resolve(rows);

            }

        );

    });

}

function calcularSaldo(){

    return new Promise((resolve,reject)=>{

        db.all(

            "SELECT * FROM financeiro",

            (err,rows)=>{

                if(err) return reject(err);

                let saldo=0;

                rows.forEach(r=>{

                    if(r.tipo==="entrada")

                        saldo += Number(r.valor);

                    else

                        saldo -= Number(r.valor);

                });

                resolve(saldo);

            }

        );

    });

}

module.exports={

    adicionarMovimento,

    listarMovimentos,

    calcularSaldo

};