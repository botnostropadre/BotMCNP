const { EmbedBuilder } = require("discord.js");
const COLORS = require("../config/colors");
const { criarFinanceiro } = require("../embeds/financeiroEmbed");

function criarDashboard(stats) {

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle("🏍 PADRE NOSSO MC")

        .setDescription(
`# 📊 Dashboard Administrativo

👥 **Total de membros:** ${stats.total}

🟢 **Prospects:** ${stats.prospect}

⚪ **Membros:** ${stats.membro}

🔴 **Diretoria:** ${stats.diretoria}

⚠ **Advertências:** ${stats.advertencias}`
        )

        .setTimestamp()

        .setFooter({

            text: "Padre Nosso MC"

        });

}

module.exports = {

    criarDashboard

};