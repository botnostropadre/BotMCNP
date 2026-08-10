const {
    buscarAcaoMarcada,
    listarParticipantes
} = require("./acaoService");

const {
    criarAcaoMarcadaEmbed
} = require("../embeds/acaoMarcadaEmbed");

const {
    criarAcaoParticipacaoButtons
} = require("../buttons/acaoParticipacaoButtons");

// ======================================================
// ATUALIZAR EMBED DA AÇÃO
// ======================================================

async function atualizarAcao(
    interaction,
    acaoMarcadaId
) {

    const acao =
        await buscarAcaoMarcada(
            acaoMarcadaId
        );

    if (!acao) {

        throw new Error(
            "A ação marcada não foi encontrada."
        );

    }

    const participantes =
        await listarParticipantes(
            acaoMarcadaId
        );

    const embed =
        criarAcaoMarcadaEmbed(
            acao,
            participantes
        );

    const componentes =
        criarAcaoParticipacaoButtons(
            acaoMarcadaId
        );

    if (
        interaction.message
    ) {

        await interaction.message.edit({

            embeds: [
                embed
            ],

            components:
                componentes

        });

        return;

    }

    if (
        acao.canalId &&
        acao.mensagemId
    ) {

        const canal =
            interaction.guild.channels.cache.get(
                acao.canalId
            ) ||
            await interaction.guild.channels
                .fetch(
                    acao.canalId
                )
                .catch(() => null);

        if (
            !canal ||
            !canal.isTextBased()
        ) {

            throw new Error(
                "O canal da ação marcada não foi encontrado."
            );

        }

        const mensagem =
            await canal.messages
                .fetch(
                    acao.mensagemId
                )
                .catch(() => null);

        if (!mensagem) {

            throw new Error(
                "A mensagem da ação marcada não foi encontrada."
            );

        }

        await mensagem.edit({

            embeds: [
                embed
            ],

            components:
                componentes

        });

    }

}

module.exports = {
    atualizarAcao
};