const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

// ======================================================
// ORDEM OFICIAL DAS CATEGORIAS
// ======================================================

const CATEGORIAS = [

    {
        chave: "armas",
        nome: "Armas",
        emoji: "🔫"
    },

    {
        chave: "municoes",
        nome: "Munições",
        emoji: "💥"
    },

    {
        chave: "drogas",
        nome: "Drogas",
        emoji: "🌿"
    },

    {
        chave: "contrabando",
        nome: "Contrabando",
        emoji: "📦"
    },

    {
        chave: "desmanche",
        nome: "Desmanche",
        emoji: "🚗"
    },

    {
        chave: "hospital ilegal",
        nome: "Hospital Ilegal",
        emoji: "🏥"
    },

    {
        chave: "restaurantes",
        nome: "Restaurantes",
        emoji: "🍽️"
    },

    {
        chave: "mecanicas",
        nome: "Mecânicas",
        emoji: "🔧"
    }

];

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
// NORMALIZAR CATEGORIA
// ======================================================

function normalizarCategoria(categoria = "") {

    const valor =
        normalizarTexto(categoria);

    const mapa = {

        arma:
            "armas",

        armas:
            "armas",

        municao:
            "municoes",

        municoes:
            "municoes",

        droga:
            "drogas",

        drogas:
            "drogas",

        contrabando:
            "contrabando",

        desmanche:
            "desmanche",

        "hospital ilegal":
            "hospital ilegal",

        hospital:
            "hospital ilegal",

        restaurante:
            "restaurantes",

        restaurantes:
            "restaurantes",

        mecanica:
            "mecanicas",

        mecanicas:
            "mecanicas"

    };

    return mapa[valor] || valor;

}

// ======================================================
// FORMATAR RESPONSÁVEIS
// ======================================================

function formatarResponsaveis(parceiro) {

    const responsaveis = [];

    if (
        parceiro.responsavel1 &&
        parceiro.telefone1
    ) {

        responsaveis.push(
            `👤 **${parceiro.responsavel1}** — 📞 ${parceiro.telefone1}`
        );

    }

    if (
        parceiro.responsavel2 &&
        parceiro.telefone2
    ) {

        responsaveis.push(
            `👤 **${parceiro.responsavel2}** — 📞 ${parceiro.telefone2}`
        );

    }

    if (
        parceiro.responsavel3 &&
        parceiro.telefone3
    ) {

        responsaveis.push(
            `👤 **${parceiro.responsavel3}** — 📞 ${parceiro.telefone3}`
        );

    }

    return responsaveis.length > 0
        ? responsaveis.join("\n")
        : "Nenhum responsável informado.";

}

// ======================================================
// FORMATAR PRODUTOS
// ======================================================

function formatarProdutos(produtos = []) {

    if (
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {

        return "Nenhum produto cadastrado.";

    }

    return produtos
        .map(produto => {

            return (
                `• **${produto.produto}** — ` +
                `${produto.valor}`
            );

        })
        .join("\n");

}

// ======================================================
// FORMATAR PARCEIRO
// ======================================================

function formatarParceiro(parceiro) {

    return (
`## ${parceiro.nomeFaccao}

**Contatos**

${formatarResponsaveis(parceiro)}

**Produtos e valores**

${formatarProdutos(parceiro.produtos)}`
    );

}

// ======================================================
// CRIAR EMBEDS DOS PARCEIROS
// ======================================================

function criarParceiroEmbeds(
    parceiros = []
) {

    const grupos = new Map();

    for (const categoria of CATEGORIAS) {

        grupos.set(
            categoria.chave,
            []
        );

    }

    for (const parceiro of parceiros) {

        const categoriaNormalizada =
            normalizarCategoria(
                parceiro.categoria
            );

        if (
            grupos.has(
                categoriaNormalizada
            )
        ) {

            grupos
                .get(
                    categoriaNormalizada
                )
                .push(parceiro);

        }

    }

    const embeds = [];

    for (const categoria of CATEGORIAS) {

        const parceirosCategoria =
            grupos.get(
                categoria.chave
            ) || [];

        if (
            parceirosCategoria.length === 0
        ) {

            continue;

        }

        const descricao =
            parceirosCategoria
                .map(formatarParceiro)
                .join(
                    "\n\n━━━━━━━━━━━━━━━━━━━━\n\n"
                );

        const embed =
            new EmbedBuilder()

                .setColor(
                    COLORS.VERDE
                )

                .setTitle(
                    `${categoria.emoji} ${categoria.nome.toUpperCase()}`
                )

                .setDescription(
                    descricao.slice(
                        0,
                        4096
                    )
                )

                .setFooter({

                    text:
                        `${settings.mc.nome} • Sistema de Parceiros`

                })

                .setTimestamp();

        embeds.push(embed);

    }

    if (embeds.length === 0) {

        embeds.push(

            new EmbedBuilder()

                .setColor(
                    COLORS.VERDE
                )

                .setTitle(
                    "🤝 Parceiros da Organização"
                )

                .setDescription(
                    "Nenhum parceiro foi cadastrado até o momento."
                )

                .setFooter({

                    text:
                        `${settings.mc.nome} • Sistema de Parceiros`

                })

                .setTimestamp()

        );

    }

    return embeds;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {

    criarParceiroEmbeds,

    normalizarCategoria,

    CATEGORIAS

};