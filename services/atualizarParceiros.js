const {
    listarParceiros,
    obterPainelParceiros,
    salvarPainelParceiros
} = require("./parceiroService");

const {
    criarParceiroEmbeds
} = require("../embeds/parceiroEmbed");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const CANAL_PARCEIROS =
    "1535012775028588564";

// ======================================================
// ATUALIZAR PAINEL DE PARCEIROS
// ======================================================

async function atualizarParceiros(client) {

    if (!client) {

        throw new Error(
            "O cliente do Discord não foi informado."
        );

    }

    const canal =
        client.channels.cache.get(
            CANAL_PARCEIROS
        ) ||
        await client.channels
            .fetch(CANAL_PARCEIROS)
            .catch(() => null);

    if (
        !canal ||
        !canal.isTextBased()
    ) {

        throw new Error(
            "O canal de parceiros não foi encontrado."
        );

    }

    const parceiros =
        await listarParceiros();

    const embeds =
        criarParceiroEmbeds(
            parceiros
        );

    const painel =
        await obterPainelParceiros();

    let mensagem = null;

    // ==================================================
    // LOCALIZAR MENSAGEM EXISTENTE
    // ==================================================

    if (
        painel?.mensagemId &&
        painel?.canalId === canal.id
    ) {

        mensagem =
            await canal.messages
                .fetch(
                    painel.mensagemId
                )
                .catch(() => null);

    }

    // ==================================================
    // ATUALIZAR OU CRIAR PAINEL
    // ==================================================

    if (mensagem) {

        await mensagem.edit({

            embeds,

            components: []

        });

    } else {

        mensagem =
            await canal.send({

                embeds,

                components: []

            });

        try {

            await mensagem.pin();

        } catch {}

    }

    // ==================================================
    // SALVAR REFERÊNCIA DO PAINEL
    // ==================================================

    await salvarPainelParceiros({

        canalId:
            canal.id,

        mensagemId:
            mensagem.id

    });

    return {

        mensagem,

        parceiros,

        embeds

    };

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    atualizarParceiros
};