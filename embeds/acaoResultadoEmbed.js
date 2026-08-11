const {
    EmbedBuilder
} = require("discord.js");

const COLORS =
    require("../config/colors");

const settings =
    require("../config/settings.json");

// ======================================================
// EMBED — RESULTADO FINAL DA AÇÃO
// ======================================================

function criarAcaoResultadoEmbed({
    acao,
    resultado,
    participantes,
    kills,
    finalizadoPor
}) {

    const participantesReais =
        participantes.filter(
            participante =>
                Number(
                    participante.participou
                ) === 1
        );

    const totalKills =
        kills.reduce(
            (total, registro) =>
                total +
                Number(
                    registro.kills || 0
                ),
            0
        );

    const ranking =
        [...kills]

            .sort(
                (a, b) =>
                    Number(b.kills) -
                    Number(a.kills)
            )

            .map(
                (registro, indice) =>
                    `${indice + 1}. <@${registro.discordId}> — **${registro.kills} kill(s)**`
            )

            .join("\n") ||
            "Nenhuma kill registrada.";

    const equipe =
        participantesReais

            .map(
                (participante, indice) =>
                    `${indice + 1}. <@${participante.discordId}>`
            )

            .join("\n") ||
            "Nenhum participante.";

    const resultadoEmoji =
        resultado.resultado ===
        "Vitória"
            ? "🏆"
            : "💀";

    const embed =
        new EmbedBuilder()

            .setColor(
                resultado.resultado ===
                "Vitória"
                    ? COLORS.VERDE
                    : COLORS.VERMELHO
            )

            .setTitle(
                `${resultadoEmoji} RESULTADO — ${acao.nomeAcao}`
            )

            .setDescription(
`**${acao.porte} Porte**

📌 **Resultado:** ${resultadoEmoji} ${resultado.resultado}

💰 **Rendimento**
${Number(
    resultado.valorRendido || 0
).toLocaleString(
    "pt-BR",
    {
        style:
            "currency",

        currency:
            "BRL"
    }
)}

💀 **Kills totais:** ${totalKills}

👥 **Participantes:** ${participantesReais.length}`
            )

            .addFields(

                {
                    name:
                        "👥 Equipe",

                    value:
                        equipe,

                    inline:
                        false
                },

                {
                    name:
                        "💀 Desempenho Individual",

                    value:
                        ranking,

                    inline:
                        false
                }

            );

    if (
        resultado.observacoes
    ) {

        embed.addFields({

            name:
                "📝 Observações",

            value:
                resultado.observacoes,

            inline:
                false

        });

    }

    embed.addFields({

        name:
            "🛡 Finalizado por",

        value:
            `${finalizadoPor}`,

        inline:
            false

    });

    if (
        acao.imagemPerimetro
    ) {

        embed.setImage(
            acao.imagemPerimetro
        );

    }

    return embed

        .setFooter({

            text:
                `${settings.mc.nome} • Histórico de Ações`

        })

        .setTimestamp();

}

module.exports = {
    criarAcaoResultadoEmbed
};