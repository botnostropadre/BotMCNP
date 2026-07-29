const { EmbedBuilder } = require("discord.js");
const COLORS = require("../config/colors");

function criarFicha(usuario, dados, advertencias = 0) {

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle("📋 Ficha do Integrante")

        .setDescription(
`━━━━━━━━━━━━━━━━━━━━━━
**Padre Nosso MC**
━━━━━━━━━━━━━━━━━━━━━━`
        )

        .setThumbnail(usuario.displayAvatarURL({ dynamic: true }))

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
                name: "📝 Secretário",
                value: dados.secretario,
                inline: true
            },

            {
                name: "📅 Registro",
                value: dados.dataRegistro,
                inline: false
            },

            {
                name: "⚠ Advertências",
                value: `${advertencias}`,
                inline: true
            },

            {
                name: "📈 Promoções",
                value: "0",
                inline: true
            },

            {
                name: "📉 Rebaixamentos",
                value: "0",
                inline: true
            },

            {
                name: "📌 Status",
                value: "🟢 Ativo",
                inline: true
            },

            {
                name: "💬 Discord",
                value: `${usuario}`,
                inline: true
            }

        )

        .setFooter({

            text: "🇮🇹 Padre Nosso MC"

        })

        .setTimestamp();

}

module.exports = {

    criarFicha

};