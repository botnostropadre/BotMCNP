const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

// ======================================================
// PAINEL FINANCEIRO
// ======================================================

function criarFinanceiro(saldo) {

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle(`💰 Caixa da ${settings.mc.nome}`)

        .setDescription(

`# 💵 Financeiro

### Saldo Atual

## ${saldo.toLocaleString(
    "pt-BR",
    {
        style: "currency",
        currency: "BRL"
    }
)}`

        )

        .setFooter({

            text: `${settings.mc.nome} • Sistema Financeiro`

        })

        .setTimestamp();

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarFinanceiro

};