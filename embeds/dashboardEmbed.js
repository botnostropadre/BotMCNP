const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

// ======================================================
// DASHBOARD PRINCIPAL
// ======================================================

function criarDashboard(stats) {

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle(`💵 ${settings.mc.nome.toUpperCase()}`)

        .setDescription(
`# 📊 Painel Administrativo

👥 **Total de Integrantes:** ${stats.total}

🎓 **Em Treinamento:** ${stats.prospect}

🤝 **Membros:** ${stats.membro}

🏛️ **Liderança e Gestão:** ${stats.diretoria}

⚠️ **Advertências:** ${stats.advertencias}`
        )

        .setFooter({

            text:
                `${settings.mc.nome} • Painel Administrativo`

        })

        .setTimestamp();

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarDashboard

};