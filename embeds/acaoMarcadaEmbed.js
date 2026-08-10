const {
    EmbedBuilder
} = require("discord.js");

const COLORS =
    require("../config/colors");

const settings =
    require("../config/settings.json");

// ======================================================
// FORMATAR LISTA
// ======================================================

function formatarLista(
    participantes,
    tipo,
    limite
) {

    const filtrados =
        participantes.filter(
            participante =>
                participante.tipo === tipo
        );

    const linhas = [];

    for (
        let i = 0;
        i < limite;
        i++
    ) {

        const participante =
            filtrados[i];

        if (participante) {

            linhas.push(
                `${i + 1}. <@${participante.discordId}>`
            );

        } else {

            linhas.push(
                `${i + 1}. 🟢 Disponível`
            );

        }

    }

    return linhas.join("\n");

}

// ======================================================
// CRIAR EMBED DA AÇÃO
// ======================================================

function criarAcaoMarcadaEmbed(
    acao,
    participantes = []
) {

    const contingente =
        Number(
            acao.contingente
        );

    const reservas =
        Number(
            acao.reservas ?? 2
        );

    const titulares =
        participantes.filter(
            participante =>
                participante.tipo ===
                "Titular"
        );

    const reservasAtuais =
        participantes.filter(
            participante =>
                participante.tipo ===
                "Reserva"
        );

    const embed =
        new EmbedBuilder()

            .setColor(
                COLORS.VERDE
            )

            .setTitle(
                `🎯 ${acao.nomeAcao || acao.nome}`
            )

            .setDescription(
`**${acao.porte} Porte**

👥 **Contingente:** ${contingente}
🪑 **Reservas:** ${reservas}

🔫 **Armamento**
${acao.armamento || "Não informado"}

📋 **Regras principais**
${acao.resumoRegras || "Nenhuma regra cadastrada."}`
            )

            .addFields(

                {
                    name:
                        `✅ TITULARES — ${titulares.length}/${contingente}`,

                    value:
                        formatarLista(
                            participantes,
                            "Titular",
                            contingente
                        ),

                    inline:
                        false
                },

                {
                    name:
                        `🪑 RESERVAS — ${reservasAtuais.length}/${reservas}`,

                    value:
                        formatarLista(
                            participantes,
                            "Reserva",
                            reservas
                        ),

                    inline:
                        false
                }

            )

            .setFooter({

                text:
                    `${settings.mc.nome} • Sistema de Ações`

            })

            .setTimestamp();

    if (
        acao.imagemPerimetro
    ) {

        embed.setImage(
            acao.imagemPerimetro
        );

    }

    return embed;

}

module.exports = {
    criarAcaoMarcadaEmbed
};