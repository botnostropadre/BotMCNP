const {
    EmbedBuilder
} = require("discord.js");

const COLORS =
    require("../config/colors");

const settings =
    require("../config/settings.json");

// ======================================================
// FORMATAR PARCEIRO
// ======================================================

function formatarParceiro(
    parceiro
) {

    const nomeFaccao =
        parceiro.nomeFaccao ||
        "FAC não informada";

    const produto =
        parceiro.produto ||
        "Não informado";

    const descricao =
        parceiro.descricao ||
        "Nenhuma descrição informada.";

    const salaDarkChat =
        parceiro.salaDarkChat ||
        "Não informada";

    const senhaSala =
        parceiro.senhaSala ||
        "Não informada";

    return (
`## 🏛️ ${nomeFaccao}

📦 **Produto**
${produto}

📝 **Descrição**
${descricao}

💬 **Sala do Dark Chat**
${salaDarkChat}

🔐 **Senha da sala**
${senhaSala}`
    );

}

// ======================================================
// DIVIDIR PARCEIROS EM EMBEDS
// ======================================================

function criarParceiroEmbeds(
    parceiros = []
) {

    if (
        !Array.isArray(
            parceiros
        ) ||
        parceiros.length === 0
    ) {

        return [

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

        ];

    }

    // ==================================================
    // GERAR BLOCOS
    // ==================================================

    const blocos =
        parceiros.map(
            formatarParceiro
        );

    const embeds =
        [];

    let descricaoAtual =
        "";

    // ==================================================
    // RESPEITAR LIMITE DO DISCORD
    // ==================================================

    for (
        const bloco
        of blocos
    ) {

        const separador =
            descricaoAtual
                ? "\n\n━━━━━━━━━━━━━━━━━━━━\n\n"
                : "";

        const novoConteudo =
            descricaoAtual +
            separador +
            bloco;

        // Discord permite até 4096 caracteres
        // na descrição de um embed.

        if (
            novoConteudo.length >
            4096
        ) {

            if (
                descricaoAtual
            ) {

                embeds.push(

                    new EmbedBuilder()

                        .setColor(
                            COLORS.VERDE
                        )

                        .setTitle(
                            "🤝 Parceiros da Organização"
                        )

                        .setDescription(
                            descricaoAtual
                        )

                        .setFooter({

                            text:
                                `${settings.mc.nome} • Sistema de Parceiros`

                        })

                        .setTimestamp()

                );

            }

            // Caso uma única parceria tenha uma
            // descrição muito grande.

            descricaoAtual =
                bloco.slice(
                    0,
                    4096
                );

        } else {

            descricaoAtual =
                novoConteudo;

        }

    }

    // ==================================================
    // ÚLTIMO EMBED
    // ==================================================

    if (
        descricaoAtual
    ) {

        embeds.push(

            new EmbedBuilder()

                .setColor(
                    COLORS.VERDE
                )

                .setTitle(
                    "🤝 Parceiros da Organização"
                )

                .setDescription(
                    descricaoAtual
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
    criarParceiroEmbeds
};