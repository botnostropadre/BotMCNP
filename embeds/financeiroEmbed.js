const { EmbedBuilder } = require("discord.js");
const COLORS = require("../config/colors");

function criarFinanceiro(saldo){

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle("💰 Caixa do Padre Nosso MC")

        .setDescription(

`# Financeiro

💵 Saldo Atual

## R$ ${saldo.toLocaleString("pt-BR")}`

        )

        .setFooter({

            text:"Padre Nosso MC"

        })

        .setTimestamp();

}

module.exports = {
    criarFinanceiro: criarFinanceiro
};