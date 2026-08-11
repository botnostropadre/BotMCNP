const {
    EmbedBuilder
} = require("discord.js");

const db =
    require("../database/database");

const COLORS =
    require("../config/colors");

const settings =
    require("../config/settings.json");

// ======================================================
// CONSULTAR TODAS AS LINHAS
// ======================================================

function consultarTodos(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.all(
                sql,
                parametros,
                (
                    error,
                    rows
                ) => {

                    if (error) {

                        return reject(
                            error
                        );

                    }

                    resolve(
                        rows || []
                    );

                }
            );

        }
    );

}

// ======================================================
// CONSULTAR UMA LINHA
// ======================================================

function consultarUm(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.get(
                sql,
                parametros,
                (
                    error,
                    row
                ) => {

                    if (error) {

                        return reject(
                            error
                        );

                    }

                    resolve(
                        row || null
                    );

                }
            );

        }
    );

}

// ======================================================
// EXECUTAR SQL
// ======================================================

function executar(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.run(
                sql,
                parametros,
                function (error) {

                    if (error) {

                        return reject(
                            error
                        );

                    }

                    resolve(this);

                }
            );

        }
    );

}

// ======================================================
// GERAR ESTATÍSTICAS DOS MEMBROS
// ======================================================

async function obterResumoPvp() {

    return consultarTodos(
        `
            SELECT

                ap.discordId,

                MAX(ap.nome)
                    AS nome,

                COUNT(
                    DISTINCT am.id
                )
                    AS acoesParticipadas,

                SUM(
                    CASE
                        WHEN ar.resultado = 'Vitória'
                        THEN 1
                        ELSE 0
                    END
                )
                    AS vitorias,

                SUM(
                    CASE
                        WHEN ar.resultado = 'Derrota'
                        THEN 1
                        ELSE 0
                    END
                )
                    AS derrotas,

                COALESCE(
                    SUM(ak.kills),
                    0
                )
                    AS kills,

                COALESCE(
                    SUM(ar.valorRendido),
                    0
                )
                    AS valorGerado

            FROM acoesParticipantes ap

            INNER JOIN acoesMarcadas am
                ON am.id =
                    ap.acaoMarcadaId

            INNER JOIN acoesResultados ar
                ON ar.acaoMarcadaId =
                    am.id

            LEFT JOIN acoesKills ak
                ON ak.acaoMarcadaId =
                    am.id
                AND ak.discordId =
                    ap.discordId

            WHERE
                am.status = 'Finalizada'

                AND ap.participou = 1

            GROUP BY
                ap.discordId

            ORDER BY
                kills DESC,
                vitorias DESC,
                acoesParticipadas DESC
        `
    );

}

// ======================================================
// CRIAR EMBED
// ======================================================

function criarResumoEmbed(
    dados
) {

    const embed =
        new EmbedBuilder()

            .setColor(
                COLORS.VERDE
            )

            .setTitle(
                "💀 Resumo dos PVPs"
            )

            .setDescription(
`Abaixo estão as estatísticas individuais dos integrantes nas ações finalizadas.

━━━━━━━━━━━━━━━━━━━━━━`
            );

    if (
        dados.length === 0
    ) {

        embed.addFields({

            name:
                "📊 Nenhum dado disponível",

            value:
                "Ainda não existem ações finalizadas com participantes registrados.",

            inline:
                false

        });

        return embed

            .setFooter({

                text:
                    `${settings.mc.nome} • Estatísticas de PVP`

            })

            .setTimestamp();

    }

    const limite =
        Math.min(
            dados.length,
            20
        );

    for (
        let i = 0;
        i < limite;
        i++
    ) {

        const membro =
            dados[i];

        const acoes =
            Number(
                membro.acoesParticipadas ||
                0
            );

        const vitorias =
            Number(
                membro.vitorias ||
                0
            );

        const derrotas =
            Number(
                membro.derrotas ||
                0
            );

        const kills =
            Number(
                membro.kills ||
                0
            );

        const valorGerado =
            Number(
                membro.valorGerado ||
                0
            );

        const mediaKills =
            acoes > 0
                ? (
                    kills /
                    acoes
                ).toFixed(2)
                : "0.00";

        embed.addFields({

            name:
                `${i + 1}. ${membro.nome || "Integrante"}`,

            value:
`🎯 Ações: **${acoes}**
✅ Vitórias: **${vitorias}**
❌ Derrotas: **${derrotas}**
💀 Kills: **${kills}**
📊 Média: **${mediaKills} kills/ação**
💰 Valor gerado: **${valorGerado.toLocaleString(
                "pt-BR",
                {
                    style:
                        "currency",

                    currency:
                        "BRL"
                }
            )}**
💬 Discord: <@${membro.discordId}>`,

            inline:
                false

        });

    }

    if (
        dados.length > limite
    ) {

        embed.addFields({

            name:
                "ℹ️ Observação",

            value:
                `Exibindo os **${limite} melhores colocados** de ${dados.length} integrantes com histórico de PVP.`,

            inline:
                false

        });

    }

    return embed

        .setFooter({

            text:
                `${settings.mc.nome} • Estatísticas de PVP`

        })

        .setTimestamp();

}

// ======================================================
// ATUALIZAR PAINEL
// ======================================================

async function atualizarResumoPvp(
    client
) {

    const CANAL_RESUMO_PVP =
        "1536497621991035001";

    const guild =
        client.guilds.cache.get(
            settings.guildId
        ) ||
        await client.guilds
            .fetch(
                settings.guildId
            )
            .catch(() => null);

    if (!guild) {

        throw new Error(
            "Servidor não encontrado para atualizar o Resumo dos PVPs."
        );

    }

    const canal =
        guild.channels.cache.get(
            CANAL_RESUMO_PVP
        ) ||
        await guild.channels
            .fetch(
                CANAL_RESUMO_PVP
            )
            .catch(() => null);

    if (
        !canal ||
        !canal.isTextBased()
    ) {

        throw new Error(
            "Canal de Resumo dos PVPs não encontrado."
        );

    }

    const dados =
        await obterResumoPvp();

    const embed =
        criarResumoEmbed(
            dados
        );

    const painel =
        await consultarUm(
            `
                SELECT *
                FROM painelResumoPvp
                WHERE id = 1
            `
        );

    let mensagem =
        null;

    if (
        painel?.mensagemId
    ) {

        mensagem =
            await canal.messages
                .fetch(
                    painel.mensagemId
                )
                .catch(() => null);

    }

    if (mensagem) {

        await mensagem.edit({

            embeds: [
                embed
            ]

        });

    } else {

        mensagem =
            await canal.send({

                embeds: [
                    embed
                ]

            });

        try {

            await mensagem.pin();

        } catch {}

    }

    await executar(
        `
            INSERT INTO painelResumoPvp (

                id,
                canalId,
                mensagemId,
                ultimaAtualizacao

            )

            VALUES (1, ?, ?, ?)

            ON CONFLICT(id)
            DO UPDATE SET

                canalId =
                    excluded.canalId,

                mensagemId =
                    excluded.mensagemId,

                ultimaAtualizacao =
                    excluded.ultimaAtualizacao
        `,
        [
            canal.id,
            mensagem.id,
            new Date().toLocaleString(
                "pt-BR"
            )
        ]
    );

    return mensagem;

}

module.exports = {
    atualizarResumoPvp
};