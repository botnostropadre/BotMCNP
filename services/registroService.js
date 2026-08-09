const db = require("../database/database");
const settings = require("../config/settings.json");
const COLORS = require("../config/colors");

// ======================================================
// EXECUTAR COMANDO NO BANCO
// ======================================================

function executarBanco(sql, parametros = []) {

    return new Promise((resolve, reject) => {

        db.run(sql, parametros, function (error) {

            if (error) {
                return reject(error);
            }

            resolve(this);

        });

    });

}

// ======================================================
// REGISTRAR SOLICITAÇÃO
// ======================================================

async function registrar(interaction, dados) {

    const nome =
        dados.nome?.trim();

    const idCidade =
        dados.idCidade?.trim();

    const recrutador =
        dados.recrutador?.trim();

    const areaInformada =
        dados.areaDesejada?.trim();

    const liveInformada =
        dados.live?.trim();

    // ==================================================
    // VALIDAR CAMPOS
    // ==================================================

    if (
        !nome ||
        !idCidade ||
        !recrutador ||
        !areaInformada ||
        !liveInformada
    ) {

        throw new Error(
            "Todos os campos do registro precisam ser preenchidos."
        );

    }

    // ==================================================
    // VALIDAR NOME
    // ==================================================

    if (
        nome.length < 2 ||
        nome.length > 50
    ) {

        throw new Error(
            "O nome precisa possuir entre 2 e 50 caracteres."
        );

    }

    // ==================================================
    // VALIDAR ID
    // ==================================================

    if (
        !/^\d+$/.test(idCidade)
    ) {

        throw new Error(
            "O ID deve conter apenas números."
        );

    }

    // ==================================================
    // NORMALIZAR ÁREA DE INTERESSE
    // ==================================================

    const normalizarTexto = texto => {

        return texto

            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .trim()

            .toLowerCase();

    };

    const areasPermitidas = {

        elite:
            "Elite",

        evento:
            "Eventos",

        eventos:
            "Eventos",

        farm:
            "Farm"

    };

    const areaDesejada =
        areasPermitidas[
            normalizarTexto(
                areaInformada
            )
        ];

    if (!areaDesejada) {

        throw new Error(
            "Área inválida. Informe apenas: Elite, Eventos ou Farm."
        );

    }

    // ==================================================
    // VALIDAR LIVE
    // ==================================================

    const liveNormalizada =
        normalizarTexto(
            liveInformada
        );

    let fazLive = false;
    let linkLive = null;

    const respostasNegativas = [
        "nao",
        "n",
        "não",
        "no",
        "false"
    ];

    if (
        respostasNegativas.includes(
            liveNormalizada
        )
    ) {

        fazLive = false;
        linkLive = null;

    } else {

        try {

            const url =
                new URL(
                    liveInformada
                );

            if (
                ![
                    "http:",
                    "https:"
                ].includes(
                    url.protocol
                )
            ) {

                throw new Error(
                    "Protocolo inválido."
                );

            }

            fazLive = true;
            linkLive =
                liveInformada;

        } catch {

            throw new Error(
                "Se você faz live, informe o link completo do seu canal. Caso não faça, escreva apenas \"Não\"."
            );

        }

    }

    // ==================================================
    // VALIDAR SERVIDOR
    // ==================================================

    if (!interaction.guild) {

        throw new Error(
            "O registro só pode ser realizado dentro do servidor."
        );

    }

    // ==================================================
    // BUSCAR INTEGRANTE
    // ==================================================

    let membro;

    try {

        membro =
            await interaction.guild.members.fetch(
                interaction.user.id
            );

    } catch (error) {

        console.error(
            "Erro ao localizar integrante durante o registro:",
            error
        );

        throw new Error(
            "Não foi possível localizar seu usuário no servidor."
        );

    }

    // ==================================================
    // VERIFICAR SE JÁ É INTEGRANTE
    // ==================================================

    const cadastroExistente =
        await new Promise(
            (resolve, reject) => {

                db.get(
                    `
                        SELECT discordId
                        FROM membros
                        WHERE discordId = ?
                    `,
                    [
                        interaction.user.id
                    ],
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

    if (cadastroExistente) {

        throw new Error(
            `Você já possui um registro aprovado no sistema da ${settings.mc.nome}.`
        );

    }

           // ==================================================
    // VERIFICAR SOLICITAÇÃO PENDENTE
    // ==================================================

    const solicitacaoPendente =
        await new Promise(
            (resolve, reject) => {

                db.get(
                    `
                        SELECT id
                        FROM registrosPendentes
                        WHERE discordId = ?
                        AND status = 'Pendente'
                    `,
                    [
                        interaction.user.id
                    ],
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

    if (solicitacaoPendente) {

        throw new Error(
            "Você já possui um registro aguardando análise."
        );

    }

    // ==================================================
    // SALVAR SOLICITAÇÃO NO BANCO
    // ==================================================

    const dataSolicitacao =
        new Date().toLocaleString(
            "pt-BR"
        );

    let registroId;

    try {

        const resultado =
            await executarBanco(
                `
                    INSERT INTO registrosPendentes (

                        discordId,
                        nome,
                        idCidade,
                        recrutador,
                        areaDesejada,
                        fazLive,
                        linkLive,
                        status,
                        criadoEm

                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    interaction.user.id,
                    nome,
                    idCidade,
                    recrutador,
                    areaDesejada,
                    fazLive ? 1 : 0,
                    linkLive,
                    "Pendente",
                    dataSolicitacao
                ]
            );

        registroId =
            resultado.lastID;

    } catch (error) {

        console.error(
            "Erro ao salvar solicitação de registro:",
            error
        );

        throw new Error(
            `Não foi possível salvar sua solicitação: ${error.message}`
        );

    }

    // ==================================================
    // CANAL DE APROVAÇÃO
    // ==================================================

    const CANAL_APROVAR_REGISTRO =
        "1535820712189890610";

    const canalAprovacao =
        interaction.guild.channels.cache.get(
            CANAL_APROVAR_REGISTRO
        ) ||
        await interaction.guild.channels
            .fetch(
                CANAL_APROVAR_REGISTRO
            )
            .catch(() => null);

    if (
        !canalAprovacao ||
        !canalAprovacao.isTextBased()
    ) {

        await executarBanco(
            `
                DELETE FROM registrosPendentes
                WHERE id = ?
            `,
            [
                registroId
            ]
        ).catch(() => {});

        throw new Error(
            "O canal de aprovação de registros não foi encontrado."
        );

    }

    // ==================================================
    // IMPORTS LOCAIS
    // ==================================================

    const {
        EmbedBuilder,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle,
        StringSelectMenuBuilder
    } = require("discord.js");

    // ==================================================
    // FICHA DE APROVAÇÃO
    // ==================================================

    const embed =
        new EmbedBuilder()

            .setColor(
                COLORS.VERDE
            )

            .setTitle(
                `📋 SOLICITAÇÃO DE REGISTRO — ${nome.toUpperCase()}`
            )

            .setThumbnail(
                interaction.user.displayAvatarURL({
                    size: 256
                })
            )

            .addFields(

                {
                    name:
                        "👤 Nome",

                    value:
                        nome,

                    inline:
                        true
                },

                {
                    name:
                        "🆔 ID",

                    value:
                        idCidade,

                    inline:
                        true
                },

                {
                    name:
                        "🤝 Quem recrutou",

                    value:
                        recrutador,

                    inline:
                        false
                },

                {
                    name:
                        "🎯 Área desejada",

                    value:
                        areaDesejada,

                    inline:
                        true
                },

                {
                    name:
                        "📺 Faz live?",

                    value:
                        fazLive
                            ? "Sim"
                            : "Não",

                    inline:
                        true
                },

                {
                    name:
                        "🔗 Canal",

                    value:
                        fazLive
                            ? linkLive
                            : "Não informado",

                    inline:
                        false
                },

                {
                    name:
                        "💬 Discord",

                    value:
                        `${interaction.user}`,

                    inline:
                        false
                },

                {
                    name:
                        "📌 Status",

                    value:
                        "🟡 Aguardando análise",

                    inline:
                        false
                }

            )

            .setFooter({

                text:
                    `${settings.mc.nome} • Aprovação de Registro`

            })

            .setTimestamp();

    // ==================================================
    // SELETOR DE CARGO
    // ==================================================

    const menuCargo =
        new StringSelectMenuBuilder()

            .setCustomId(
                `registro_cargo_${registroId}`
            )

            .setPlaceholder(
                "Selecione o cargo que será concedido"
            )

            .addOptions(

    {
        label:
            "Elite Teste",

        value:
            settings.cargos.eliteTeste,

        emoji:
            "🧪"
    },

    {
        label:
            "Treinamento",

        value:
            settings.cargos.treinamento,

        emoji:
            "🎓"
    },

    {
        label:
            "Membro",

        value:
            settings.cargos.membro,

        emoji:
            "🤝"
    },

    {
        label:
            "Recrutamento",

        value:
            settings.cargos.recrutamento,

        emoji:
            "📋"
    },

    {
        label:
            "Resp. Eventos",

        value:
            settings.cargos.respEventos,

        emoji:
            "📅"
    },

    {
        label:
            "Resp. Elite",

        value:
            settings.cargos.respElite,

        emoji:
            "⚔️"
    },

    {
        label:
            "Gerência",

        value:
            settings.cargos.gerencia,

        emoji:
            "🛡️"
    },

    {
        label:
            "Vice Liderança",

        value:
            settings.cargos.viceLideranca,

        emoji:
            "👑"
    },

    {
        label:
            "Liderança",

        value:
            settings.cargos.lideranca,

        emoji:
            "⭐"
    }

);

    const linhaCargo =
        new ActionRowBuilder()
            .addComponents(
                menuCargo
            );

    // ==================================================
    // BOTÕES DE APROVAR / REPROVAR
    // ==================================================

    const linhaAcoes =
        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId(
                        `registro_aprovar_${registroId}`
                    )

                    .setLabel(
                        "Aprovar"
                    )

                    .setEmoji(
                        "✅"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    ),

                new ButtonBuilder()

                    .setCustomId(
                        `registro_reprovar_${registroId}`
                    )

                    .setLabel(
                        "Reprovar"
                    )

                    .setEmoji(
                        "❌"
                    )

                    .setStyle(
                        ButtonStyle.Danger
                    )

            );

    const mensagem =
        await canalAprovacao.send({

            embeds: [
                embed
            ],

            components: [
                linhaCargo,
                linhaAcoes
            ]

        });

    // ==================================================
    // SALVAR MENSAGEM DE APROVAÇÃO
    // ==================================================

    await executarBanco(
        `
            UPDATE registrosPendentes

            SET
                canalAprovacaoId = ?,
                mensagemAprovacaoId = ?

            WHERE id = ?
        `,
        [
            canalAprovacao.id,
            mensagem.id,
            registroId
        ]
    );

    // ==================================================
    // RETORNO
    // ==================================================

    return {

        registroId,

        nome,

        idCidade,

        recrutador,

        areaDesejada,

        fazLive,

        linkLive,

        status:
            "Pendente"

    };

}

module.exports = {
    registrar
};