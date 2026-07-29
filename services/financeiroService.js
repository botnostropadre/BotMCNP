const {

    adicionarMovimento,

    calcularSaldo

} = require("../database/financeiroRepository");

async function registrarEntrada(valor, categoria, descricao, autor) {

    await adicionarMovimento(

        "entrada",

        categoria,

        valor,

        descricao,

        autor

    );

}

async function registrarSaida(valor, categoria, descricao, autor) {

    await adicionarMovimento(

        "saida",

        categoria,

        valor,

        descricao,

        autor

    );

}

async function obterSaldo() {

    return await calcularSaldo();

}

module.exports = {

    registrarEntrada,

    registrarSaida,

    obterSaldo

};