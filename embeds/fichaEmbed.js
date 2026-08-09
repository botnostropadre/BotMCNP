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

    const fazLive =
        Number(dados.fazLive) === 1 ||
        dados.fazLive === true;

    return new EmbedBuilder()

        .setColor(
            COLORS.VERDE
        )

        .setTitle(
            "📋 Perfil do Integrante"
        )

        .setDescription(
`━━━━━━━━━━━━━━━━━━━━━━
**${settings.mc.nome}**
━━━━━━━━━━━━━━━━━━━━━━`
        )

        .setThumbnail(
            usuario.displayAvatarURL({
                size: 256
            })
        )

        .addFields(

            {
                name:
                    "👤 Nome",

                value:
                    dados.nome ||
                    "Não informado",

                inline:
                    true
            },

            {
                name:
                    "🆔 ID",

                value:
                    dados.idCidade ||
                    "Não informado",

                inline:
                    true
            },

            {
                name:
                    "🎖 Cargo",

                value:
                    dados.cargo ||
                    "Não informado",

                inline:
                    true
            },

            {
                name:
                    "🤝 Recrutado por",

                value:
                    dados.recrutador ||
                    "Não informado",

                inline:
                    true
            },

            {
                name:
                    "🎯 Área",

                value:
                    dados.areaDesejada ||
                    "Não informada",

                inline:
                    true
            },

            {
                name:
                    "📺 Faz live?",

                value:
                    fazLive
                        ? "Sim"
                        : "Não",

                inline:
                    true
            },

            {
                name:
                    "🔗 Canal",

                value:
                    fazLive &&
                    dados.linkLive
                        ? dados.linkLive
                        : "Não informado",

                inline:
                    false
            },

            {
                name:
                    "📅 Data de Registro",

                value:
                    dados.dataRegistro ||
                    "Não informada",

                inline:
                    false
            },

            {
                name:
                    "⚠️ Advertências",

                value:
                    `${advertencias}`,

                inline:
                    true
            },

            {
                name:
                    "📈 Promoções",

                value:
                    `${dados.promocoes ?? 0}`,

                inline:
                    true
            },

            {
                name:
                    "📉 Rebaixamentos",

                value:
                    `${dados.rebaixamentos ?? 0}`,

                inline:
                    true
            },

            {
                name:
                    "📌 Status",

                value:
                    dados.status ||
                    "Ativo",

                inline:
                    true
            },

            {
                name:
                    "💬 Discord",

                value:
                    `${usuario}`,

                inline:
                    true
            }

        )

        .setFooter({

            text:
                `${settings.mc.nome} • Sistema de Gestão`

        })

        .setTimestamp();

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarFicha
};