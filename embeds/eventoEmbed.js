const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

// ======================================================
// NÚMEROS EM EMOJI
// ======================================================

const NUMEROS_EMOJI = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟"
];

// ======================================================
// FORMATAR PARTICIPANTES
// ======================================================

function formatarParticipantes(
    participantes,
    posicaoInicial = 0
) {

    if (
        !Array.isArray(participantes) ||
        participantes.length === 0
    ) {

        return "Nenhum integrante confirmado.";
    }

    return participantes
        .map((participante, indice) => {

            const posicao =
                posicaoInicial + indice;

            const numero =
                NUMEROS_EMOJI[posicao] ||
                `**${posicao + 1}.**`;

            const nome =
                participante.nome ||
                `<@${participante.discordId}>`;

            return `${numero} ${nome}`;

        })
        .join("\n");

}

// ======================================================
// CRIAR EMBED DO EVENTO
// ======================================================

function criarEventoEmbed({
    evento,
    auxiliares = [],
    reservas = []
}) {

    const limiteAuxiliares =
        Number(
            evento.quantidadeAuxiliares || 0
        );

    const totalAuxiliares =
        auxiliares.length;

    const totalReservas =
        reservas.length;

    const vagasAuxiliares =
        Math.max(
            limiteAuxiliares -
            totalAuxiliares,
            0
        );

    const vagasReservas =
        Math.max(
            2 -
            totalReservas,
            0
        );

    const textoAuxiliares =
        formatarParticipantes(
            auxiliares,
            0
        );

    const textoReservas =
        formatarParticipantes(
            reservas,
            limiteAuxiliares
        );

    const embed = new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle(
            `📅 ${evento.nome}`
        )

        .setDescription(
`${evento.descricao}

━━━━━━━━━━━━━━━━━━━━

📆 **Data e Hora**

${evento.dataHora}

👔 **Traje**

${evento.traje}

👤 **Responsável pelo Evento**

${evento.responsavel}

━━━━━━━━━━━━━━━━━━━━

👥 **Equipe de Auxiliares — ${totalAuxiliares}/${limiteAuxiliares}**

${textoAuxiliares}

📌 Vagas disponíveis: **${vagasAuxiliares}**

━━━━━━━━━━━━━━━━━━━━

🟡 **Reservas da Equipe — ${totalReservas}/2**

${textoReservas}

📌 Vagas disponíveis: **${vagasReservas}**`
        )

        .setFooter({
            text:
                `${settings.mc.nome} • Sistema de Eventos`
        })

        .setTimestamp();

    if (
        evento.flyer &&
        typeof evento.flyer === "string"
    ) {

        embed.setImage(
            evento.flyer
        );

    }

    return embed;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarEventoEmbed
};