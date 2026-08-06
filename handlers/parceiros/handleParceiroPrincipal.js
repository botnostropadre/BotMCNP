const {
    MessageFlags
} = require("discord.js");

const {
    criarRascunhoParceiro
} = require(
    "../../services/parceiroBuilderService"
);

const {
    criarParceiroContinuarButtons
} = require(
    "../../buttons/parceirosButton"
);

// ======================================================
// APAGAR RESPOSTA TEMPORÁRIA
// ======================================================

function apagarResposta(
    interaction,
    tempo = 10000
) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, tempo);

}

// ======================================================
// NORMALIZAR TEXTO
// ======================================================

function normalizarTexto(texto = "") {

    return texto

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .trim()

        .toLowerCase();

}

// ======================================================
// CATEGORIAS ACEITAS
// ======================================================

const CATEGORIAS = {

    arma:
        "Armas",

    armas:
        "Armas",

    municao:
        "Munições",

    municoes:
        "Munições",

    droga:
        "Drogas",

    drogas:
        "Drogas",

    contrabando:
        "Contrabando",

    desmanche:
        "Desmanche",

    hospital:
        "Hospital Ilegal",

    "hospital ilegal":
        "Hospital Ilegal",

    restaurante:
        "Restaurantes",

    restaurantes:
        "Restaurantes",

    mecanica:
        "Mecânicas",

    mecanicas:
        "Mecânicas"

};

// ======================================================
// PRIMEIRA ETAPA DO PARCEIRO
// ======================================================

async function handleParceiroPrincipal(
    interaction
) {

    if (
        !interaction.isModalSubmit() ||
        interaction.customId !==
            "parceiro_modal_principal"
    ) {

        return false;

    }

    const nomeFaccao =
        interaction.fields
            .getTextInputValue(
                "parceiro_nome_faccao"
            )
            .trim();

    const categoriaInformada =
        interaction.fields
            .getTextInputValue(
                "parceiro_categoria"
            )
            .trim();

    const categoria =
        CATEGORIAS[
            normalizarTexto(
                categoriaInformada
            )
        ];

    if (!categoria) {

        await interaction.reply({

            content:
`❌ Categoria inválida.

Utilize uma destas opções:

1. Armas
2. Munições
3. Drogas
4. Contrabando
5. Desmanche
6. Hospital Ilegal
7. Restaurantes
8. Mecânicas`,

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return true;

    }

    try {

        criarRascunhoParceiro(
            interaction.user.id,
            {
                nomeFaccao,
                categoria
            }
        );

        await interaction.reply({

            content:
`✅ Informações principais salvas.

🏛️ **Facção:** ${nomeFaccao}

📦 **Categoria:** ${categoria}

Clique em **Continuar** para cadastrar os responsáveis.`,

            components:
                criarParceiroContinuarButtons(),

            flags:
                MessageFlags.Ephemeral

        });

    } catch (error) {

        console.error(
            "Erro ao salvar primeira etapa do parceiro:",
            error
        );

        await interaction.reply({

            content:
                "❌ Não foi possível salvar as informações do parceiro.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

    }

    return true;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    handleParceiroPrincipal
};