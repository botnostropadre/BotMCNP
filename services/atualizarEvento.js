const {
    listarParticipantes
} = require("./eventoService");

const {
    criarEventoEmbed
} = require("../embeds/eventoEmbed");

const {
    criarEventoParticipacaoButtons
} = require("../buttons/eventoParticipacaoButtons");

// ======================================================
// ATUALIZAR EVENTO
// ======================================================

async function atualizarEvento(
    interaction,
    mensagemId
) {

    if (!interaction.guild) {

        throw new Error(
            "O evento só pode ser atualizado dentro do servidor."
        );

    }

    if (!mensagemId) {

        throw new Error(
            "O ID da mensagem do evento não foi informado."
        );

    }

    // ==================================================
    // BUSCAR EVENTO E PARTICIPANTES
    // ==================================================

    const resumo =
        await listarParticipantes(
            mensagemId
        );

    if (!resumo.evento) {

        throw new Error(
            "O evento não foi encontrado no banco de dados."
        );

    }

    // ==================================================
    // LOCALIZAR MENSAGEM
    // ==================================================

    let mensagem = null;

    if (
        interaction.message &&
        interaction.message.id === mensagemId
    ) {

        mensagem =
            interaction.message;

    } else {

        const canal =
            interaction.channel;

        if (
            canal &&
            canal.isTextBased()
        ) {

            mensagem =
                await canal.messages
                    .fetch(mensagemId)
                    .catch(() => null);

        }

    }

    if (!mensagem) {

        throw new Error(
            "A mensagem do evento não foi encontrada."
        );

    }

    // ==================================================
    // RECONSTRUIR EMBED
    // ==================================================

    const embed =
        criarEventoEmbed({

            evento:
                resumo.evento,

            auxiliares:
                resumo.auxiliares,

            reservas:
                resumo.reservas

        });

    // ==================================================
    // ATUALIZAR MENSAGEM
    // ==================================================

    await mensagem.edit({

        embeds: [embed],

        components:
            criarEventoParticipacaoButtons()

    });

    return resumo;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    atualizarEvento
};