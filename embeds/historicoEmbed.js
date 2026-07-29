const { EmbedBuilder } = require("discord.js");
const COLORS = require("../config/colors");

function criarHistorico(rows) {

    const descricao = rows.length === 0

        ? "Nenhuma movimentação encontrada."

        : rows.map(item =>

`**${item.tipo}**
📂 ${item.categoria}
💵 R$ ${Number(item.valor).toLocaleString("pt-BR")}
📝 ${item.descricao}
👤 ${item.responsavel}
📅 ${item.data}`

        ).join("\n\n──────────────\n\n");

    return new EmbedBuilder()

        .setColor(COLORS.BRANCO)

        .setTitle("📜 Histórico Financeiro")

        .setDescription(descricao)

        .setFooter({

            text: "Últimas 10 movimentações"

        })

        .setTimestamp();

}

module.exports = {

    criarHistorico

};