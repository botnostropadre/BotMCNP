const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

// ======================================================
// FICHA DO INTEGRANTE
// ======================================================

function criarFicha(
    usuario,
    dados,
    advertencias = 0
) {

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle("📋 Perfil do Integrante")

        .setDescription(
`━━━━━━━━━━━━━━━━━━━━━━
**${settings.mc.nome}**
━━━━━━━━━━━━━━━━━━━━━━`
        )

        .setThumbnail(
            usuario.displayAvatarURL({
                dynamic: true,
                size: 256
            })
        )

        .addFields(

            {
                name: "👤 Integrante",
                value: dados.nomeCompleto,
                inline: false
            },

            {
                name: "🎖 Cargo",
                value: dados.cargo,
                inline: true
            },

            {
                name: "📋 Recrutador",
                value: dados.secretario,
                inline: true
            },

            {
                name: "📅 Data de Registro",
                value: dados.dataRegistro,
                inline: false
            },

            {
                name: "⚠️ Advertências",
                value: `${advertencias}`,
                inline: true
            },

            {
                name: "📈 Promoções",
                value: `${dados.promocoes ?? 0}`,
                inline: true
            },

            {
                name: "📉 Rebaixamentos",
                value: `${dados.rebaixamentos ?? 0}`,
                inline: true
            },

            {
                name: "📌 Status",
                value: dados.status || "🟢 Ativo",
                inline: true
            },

            {
                name: "💬 Discord",
                value: `${usuario}`,
                inline: true
            }

        )

        .setFooter({

            text: `${settings.mc.nome} • Sistema de Gestão`

        })

        .setTimestamp();

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarFicha

};