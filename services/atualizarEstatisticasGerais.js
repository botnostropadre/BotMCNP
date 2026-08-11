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
// BUSCAR ESTATÍSTICAS GERAIS
// ======================================================

async function obterEstatisticasGerais() {

    const gerais =
        await consultarUm(
            `
                SELECT

                    COUNT(DISTINCT am.id)
                        AS totalAcoes,

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
                        SUM(ar.valorRendido),
                        0
                    )
                        AS valorTotal

                FROM acoesMarcadas am

                INNER JOIN acoesResultados ar
                    ON ar.acaoMarcadaId =
                        am.id

                WHERE
                    am.status = 'Finalizada'
            `
        );

    const kills =
        await consultarUm(
            `
                SELECT

                    COALESCE(
                        SUM(ak.kills),
                        0
                    )
                        AS killsTotais

                FROM acoesKills ak

                INNER JOIN acoesMarcadas am
                    ON am.id =
                        ak.acaoMarcadaId

                WHERE
                    am.status = 'Finalizada'
            `
        );

    const maisKills =
        await consultarUm(
            `
                SELECT

                    ak.discordId,

                    MAX(ak.nome)
                        AS nome,

                    SUM(ak.kills)
                        AS totalKills

                FROM acoesKills ak

                INNER JOIN acoesMarcadas am
                    ON am.id =
                        ak.acaoMarcadaId

                WHERE
                    am.status = 'Finalizada'

                GROUP BY
                    ak.discordId

                ORDER BY
                    totalKills DESC

                LIMIT 1
            `
        );

    const maisAcoes =
        await consultarUm(
            `
                SELECT

                    ap.discordId,

                    MAX(ap.nome)
                        AS nome,

                    COUNT(
                        DISTINCT ap.acaoMarcadaId
                    )
                        AS totalAcoes

                FROM acoesParticipantes ap

                INNER JOIN acoesMarcadas am
                    ON am.id =
                        ap.acaoMarcadaId

                WHERE
                    am.status = 'Finalizada'

                    AND ap.participou = 1

                GROUP BY
                    ap.discordId

                ORDER BY
                    totalAcoes DESC

                LIMIT 1
            `
        );

    const ultimaAcao =
        await consultarUm(
            `
                SELECT

                    am.id,

                    a.nome
                        AS nomeAcao,

                    ar.resultado,

                    ar.valorRendido,

                    am.finalizadoEm

                FROM acoesMarcadas am

                INNER JOIN acoes a
                    ON a.id =
                        am.acaoId

                INNER JOIN acoesResultados ar
                    ON ar.acaoMarcadaId =
                        am.id

                WHERE
                    am.status = 'Finalizada'

                ORDER BY
                    am.id DESC

                LIMIT 1
            `
        );

    return {
        gerais:
            gerais || {},

        kills:
            kills || {},

        maisKills,

        maisAcoes,

        ultimaAcao
    };

}

// ======================================================
// CRIAR EMBED
// ======================================================

function criarEstatisticasEmbed(
    dados
) {

    const totalAcoes =
        Number(
            dados.gerais.totalAcoes ||
            0
        );

    const vitorias =
        Number(
            dados.gerais.vitorias ||
            0
        );

    const derrotas =
        Number(
            dados.gerais.derrotas ||
            0
        );

    const valorTotal =
        Number(
            dados.gerais.valorTotal ||
            0
        );

    const killsTotais =
        Number(
            dados.kills.killsTotais ||
            0
        );

    const winRate =
        totalAcoes > 0
            ? (
                (
                    vitorias /
                    totalAcoes
                ) *
                100
            ).toFixed(1)
            : "0.0";

    const mediaKills =
        totalAcoes > 0
            ? (
                killsTotais /
                totalAcoes
            ).toFixed(2)
            : "0.00";

    const mediaValor =
        totalAcoes > 0
            ? (
                valorTotal /
                totalAcoes
            )
            : 0;

    const embed =
        new EmbedBuilder()

            .setColor(
                COLORS.VERDE
            )

            .setTitle(
                "📊 Estatísticas Gerais"
            )

            .setDescription(
`Resumo geral das ações finalizadas da **${settings.mc.nome}**.

━━━━━━━━━━━━━━━━━━━━━━`
            )

            .addFields(

                {
                    name:
                        "🎯 Ações",

                    value:
`Total: **${totalAcoes}**
✅ Vitórias: **${vitorias}**
❌ Derrotas: **${derrotas}**
🏆 Win Rate: **${winRate}%**`,

                    inline:
                        true
                },

                {
                    name:
                        "💀 PVP",

                    value:
`Kills totais: **${killsTotais}**
📈 Média por ação: **${mediaKills}**`,

                    inline:
                        true
                },

                {
                    name:
                        "💰 Rendimento",

                    value:
`Total: **${valorTotal.toLocaleString(
                        "pt-BR",
                        {
                            style:
                                "currency",

                            currency:
                                "BRL"
                        }
                    )}**

Média por ação: **${mediaValor.toLocaleString(
                        "pt-BR",
                        {
                            style:
                                "currency",

                            currency:
                                "BRL"
                        }
                    )}**`,

                    inline:
                        false
                }

            );

    if (
        dados.maisKills
    ) {

        embed.addFields({

            name:
                "👑 Mais Kills",

            value:
                `<@${dados.maisKills.discordId}> — **${dados.maisKills.totalKills} kills**`,

            inline:
                true

        });

    }

    if (
        dados.maisAcoes
    ) {

        embed.addFields({

            name:
                "🎖 Mais Ações",

            value:
                `<@${dados.maisAcoes.discordId}> — **${dados.maisAcoes.totalAcoes} ações**`,

            inline:
                true

        });

    }

    if (
        dados.ultimaAcao
    ) {

        embed.addFields({

            name:
                "📌 Última Ação",

            value:
`🎯 **${dados.ultimaAcao.nomeAcao}**
📊 Resultado: **${dados.ultimaAcao.resultado}**
💰 Rendimento: **${Number(
                dados.ultimaAcao.valorRendido ||
                0
            ).toLocaleString(
                "pt-BR",
                {
                    style:
                        "currency",

                    currency:
                        "BRL"
                }
            )}**`,

            inline:
                false

        });

    }

    return embed

        .setFooter({

            text:
                `${settings.mc.nome} • Estatísticas Gerais`

        })

        .setTimestamp();

}

// ======================================================
// ATUALIZAR PAINEL
// ======================================================

async function atualizarEstatisticasGerais(
    client
) {

    const CANAL_ESTATISTICAS =
        "1536498648081498193";

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
            "Servidor não encontrado para atualizar Estatísticas Gerais."
        );

    }

    const canal =
        guild.channels.cache.get(
            CANAL_ESTATISTICAS
        ) ||
        await guild.channels
            .fetch(
                CANAL_ESTATISTICAS
            )
            .catch(() => null);

    if (
        !canal ||
        !canal.isTextBased()
    ) {

        throw new Error(
            "Canal de Estatísticas Gerais não encontrado."
        );

    }

    const dados =
        await obterEstatisticasGerais();

    const embed =
        criarEstatisticasEmbed(
            dados
        );

    const painel =
        await consultarUm(
            `
                SELECT *
                FROM painelEstatisticasGerais
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
            INSERT INTO painelEstatisticasGerais (

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
    atualizarEstatisticasGerais
};