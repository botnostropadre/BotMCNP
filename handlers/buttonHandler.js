const {
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

const {
    criarModalRegistro
} = require("../modals/registroModal");

const {
    criarFarmModal
} = require("../modals/farmModal");

const {
    criarEventoPrincipalModal
} = require("../modals/eventoPrincipalModal");

const {
    criarEventoConfiguracaoModal
} = require("../modals/eventoConfiguracaoModal");

const {
    removerRascunhoEvento
} = require("../services/eventoBuilderService");

const {
    adicionarParticipante,
    removerParticipante
} = require("../services/eventoService");

const {
    atualizarEvento
} = require("../services/atualizarEvento");

const {
    criarEditorButtons
} = require("../buttons/embedEditorButtons");

const {
    criarModalTitulo
} = require("../modals/embedTituloModal");

const {
    criarModalDescricao
} = require("../modals/embedDescricaoModal");

const {
    criarVisualMenu
} = require("../selectMenus/embedVisualMenu");

const {
    criarImagemMenu
} = require("../selectMenus/embedImagemMenu");

const {
    criarModalCampo
} = require("../modals/embedCampoModal");

const {
    criarEditor,
    removerEditor
} = require("../services/embedBuilderService");

const {
    gerarPreviewCompleto
} = require("../services/embedPreviewService");

const {
    gerarStatusEditor
} = require("../services/embedStatusService");

const {
    criarCanalMenu
} = require("../selectMenus/embedCanalMenu");

const {
    publicarEmbed
} = require("../services/publicarEmbedService");

const db = require("../database/database");

const {
    criarAcaoFinalizarModal
} = require("../modals/acaoFinalizarModal");

const {
    criarAcaoResultadoEmbed
} = require("../embeds/acaoResultadoEmbed");
const {
    atualizarResumoPvp
} = require("../services/atualizarResumoPvp");

const {
    atualizarEstatisticasGerais
} = require("../services/atualizarEstatisticasGerais");

// ======================================================
// SISTEMA DE AÇÕES
// ======================================================

const {
    adicionarParticipanteAcao,
    removerParticipanteAcao,
    listarParticipantes,
    listarKillsAcao,
    buscarAcaoMarcada,
    buscarResultadoAcao,
    obterProgressoKills,
    finalizarAcaoMarcada
} = require("../services/acaoService");

const {
    atualizarAcao
} = require("../services/atualizarAcao");

const {
    criarAcaoKillsMenu
} = require("../selectMenus/acaoKillsMenu");

// ======================================================
// SISTEMA DE PARCEIROS
// ======================================================

const {
    criarParceiroPrincipalModal
} = require("../modals/parceiroPrincipalModal");

const {
    criarParceiroResponsaveisModal
} = require("../modals/parceiroResponsaveisModal");

const {
    criarParceiroProdutosModal
} = require("../modals/parceiroProdutosModal");

const {
    criarParceiroProdutoExtraModal
} = require("../modals/parceiroProdutoExtraModal");

const {
    removerRascunhoParceiro
} = require("../services/parceiroBuilderService");

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
// HANDLER DE BOTÕES
// ======================================================

async function handleButton(interaction) {

    if (!interaction.isButton()) return;

    // ==================================================
    // AÇÕES — CONFIRMAR PRESENÇA
    // ==================================================

    if (
        interaction.customId.startsWith(
            "acao_participar_"
        )
    ) {

        await interaction.deferReply({

            flags:
                MessageFlags.Ephemeral

        });

        try {

            const acaoMarcadaId =
                Number(
                    interaction.customId.replace(
                        "acao_participar_",
                        ""
                    )
                );

            if (
                !Number.isInteger(
                    acaoMarcadaId
                ) ||
                acaoMarcadaId <= 0
            ) {

                await interaction.editReply({

                    content:
                        "❌ Identificador da ação inválido."

                });

                apagarResposta(interaction);

                return;

            }

            const nomeExibicao =
                interaction.member?.displayName ||
                interaction.user.globalName ||
                interaction.user.username;

            const resultado =
                await adicionarParticipanteAcao({

                    acaoMarcadaId,

                    discordId:
                        interaction.user.id,

                    nome:
                        nomeExibicao

                });

            // ==========================================
            // AÇÃO ENCERRADA
            // ==========================================

            if (
                resultado.status ===
                "encerrada"
            ) {

                await interaction.editReply({

                    content:
                        "❌ Essa ação não está mais recebendo participantes."

                });

                apagarResposta(interaction);

                return;

            }

            // ==========================================
            // JÁ INSCRITO
            // ==========================================

            if (
                resultado.status ===
                "ja_inscrito"
            ) {

                await interaction.editReply({

                    content:
                        "⚠️ Você já confirmou presença nesta ação."

                });

                apagarResposta(interaction);

                return;

            }

            // ==========================================
            // AÇÃO LOTADA
            // ==========================================

            if (
                resultado.status ===
                "lotado"
            ) {

                await interaction.editReply({

                    content:
                        "❌ As vagas de titulares e reservas já estão completas."

                });

                apagarResposta(interaction);

                return;

            }

            // ==========================================
            // ATUALIZAR EMBED
            // ==========================================

            await atualizarAcao(
                interaction,
                acaoMarcadaId
            );

            // ==========================================
            // RESPOSTA
            // ==========================================

            if (
                resultado.status ===
                "titular"
            ) {

                await interaction.editReply({

                    content:
                        `✅ Presença confirmada!\n\n` +
                        `🎯 Você entrou como **TITULAR**.\n` +
                        `📌 Posição: **${resultado.ordem}**`

                });

            } else {

                await interaction.editReply({

                    content:
                        `✅ Presença confirmada!\n\n` +
                        `🪑 Você entrou como **RESERVA**.\n` +
                        `📌 Posição geral: **${resultado.ordem}**`

                });

            }

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao confirmar presença na ação:",
                error
            );

            await interaction.editReply({

                content:
                    "❌ Não foi possível confirmar sua presença na ação."

            }).catch(() => {});

            apagarResposta(interaction);

        }

        return;

    }

       // ==================================================
    // AÇÕES — SAIR DA AÇÃO
    // ==================================================

    if (
        interaction.customId.startsWith(
            "acao_sair_"
        )
    ) {

        await interaction.deferReply({
            flags:
                MessageFlags.Ephemeral
        });

        try {

            const acaoMarcadaId =
                Number(
                    interaction.customId.replace(
                        "acao_sair_",
                        ""
                    )
                );

            if (
                !Number.isInteger(
                    acaoMarcadaId
                ) ||
                acaoMarcadaId <= 0
            ) {

                await interaction.editReply({
                    content:
                        "❌ Identificador da ação inválido."
                });

                apagarResposta(interaction);

                return;

            }

            const resultado =
                await removerParticipanteAcao(
                    acaoMarcadaId,
                    interaction.user.id
                );

            // ==========================================
            // NÃO ESTAVA INSCRITO
            // ==========================================

            if (
                resultado.status ===
                "nao_inscrito"
            ) {

                await interaction.editReply({
                    content:
                        "⚠️ Você não está inscrito nesta ação."
                });

                apagarResposta(interaction);

                return;

            }

            // ==========================================
            // ATUALIZAR EMBED
            // ==========================================

            await atualizarAcao(
                interaction,
                acaoMarcadaId
            );

            await interaction.editReply({
                content:
                    "✅ Você saiu da ação.\n\n" +
                    "As posições da equipe foram reorganizadas automaticamente."
            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao sair da ação:",
                error
            );

            await interaction.editReply({
                content:
                    "❌ Não foi possível remover sua participação da ação."
            }).catch(() => {});

            apagarResposta(interaction);

        }

        return;

    }

// ==================================================
// AÇÕES — FINALIZAR
// ==================================================

if (
    interaction.customId.startsWith(
        "acao_finalizar_"
    )
) {

    // ==========================================
    // VERIFICAR PERMISSÃO
    // ==========================================

    if (
        !podeAdministrarAcoes(
            interaction
        )
    ) {

        await interaction.reply({

            content:
                "❌ Você não possui permissão para finalizar ações.",

            flags:
                MessageFlags.Ephemeral

        });

        return;

    }

    // ==========================================
    // ABRIR MODAL DE FINALIZAÇÃO
    // ==========================================

    const acaoMarcadaId =
        interaction.customId.replace(
            "acao_finalizar_",
            ""
        );

    return interaction.showModal(
        criarAcaoFinalizarModal(
            acaoMarcadaId
        )
    );

}

    // ==================================================
    // AÇÕES — INICIAR REGISTRO DE KILLS
    // ==================================================

    if (
        interaction.customId.startsWith(
            "acao_kills_iniciar_"
        )
    ) {
    // ==========================================
    // VERIFICAR PERMISSÃO
    // ==========================================

    if (
        !podeAdministrarAcoes(
            interaction
        )
    ) {

        await interaction.reply({

            content:
                "❌ Você não possui permissão para registrar kills.",

            flags:
                MessageFlags.Ephemeral

        });

        return;

    }
        await interaction.deferReply({
            flags:
                MessageFlags.Ephemeral
        });

        try {

            const acaoMarcadaId =
                Number(
                    interaction.customId.replace(
                        "acao_kills_iniciar_",
                        ""
                    )
                );

            if (
                !Number.isInteger(
                    acaoMarcadaId
                ) ||
                acaoMarcadaId <= 0
            ) {

                await interaction.editReply({
                    content:
                        "❌ Identificador da ação inválido."
                });

                apagarResposta(interaction);

                return;

            }

            // ==========================================
            // BUSCAR PARTICIPANTES
            // ==========================================

            const participantes =
                await listarParticipantes(
                    acaoMarcadaId
                );

            const participantesValidos =
                participantes.filter(
                    participante =>
                        Number(
                            participante.participou
                        ) === 1
                );

            if (
                participantesValidos.length === 0
            ) {

                await interaction.editReply({
                    content:
                        "❌ Não existem participantes registrados nesta ação."
                });

                apagarResposta(interaction);

                return;

            }

            // ==========================================
            // BUSCAR KILLS JÁ REGISTRADAS
            // ==========================================

            const killsRegistradas =
                await listarKillsAcao(
                    acaoMarcadaId
                );

            // ==========================================
            // CRIAR MENU
            // ==========================================

            const menu =
                criarAcaoKillsMenu(
                    acaoMarcadaId,
                    participantesValidos,
                    killsRegistradas
                );

            const quantidadeRegistrada =
                killsRegistradas.filter(
                    registro =>
                        participantesValidos.some(
                            participante =>
                                participante.discordId ===
                                registro.discordId
                        )
                ).length;

            // ==========================================
            // MOSTRAR PAINEL
            // ==========================================

            await interaction.editReply({

                content:
`💀 **REGISTRO DE KILLS**

Selecione abaixo o integrante que deseja preencher.

📊 **Progresso:** ${quantidadeRegistrada}/${participantesValidos.length}

Você pode selecionar novamente um integrante caso precise corrigir a quantidade de kills.`,

                components: [
                    menu
                ]

            });

        } catch (error) {

            console.error(
                "Erro ao iniciar registro de kills:",
                error
            );

            await interaction.editReply({
                content:
                    "❌ Não foi possível abrir o registro de kills."
            }).catch(() => {});

            apagarResposta(interaction);

        }

        return;

    }
// ==================================================
// AÇÕES — CORRIGIR KILLS
// ==================================================

if (
    interaction.customId.startsWith(
        "acao_kills_editar_"
    )
) {
    // ==========================================
    // VERIFICAR PERMISSÃO
    // ==========================================

    if (
        !podeAdministrarAcoes(
            interaction
        )
    ) {

        await interaction.reply({

            content:
                "❌ Você não possui permissão para corrigir kills.",

            flags:
                MessageFlags.Ephemeral

        });

        return;

    }
    await interaction.deferReply({
        flags:
            MessageFlags.Ephemeral
    });

    try {

        const acaoMarcadaId =
            Number(
                interaction.customId.replace(
                    "acao_kills_editar_",
                    ""
                )
            );

        if (
            !Number.isInteger(acaoMarcadaId) ||
            acaoMarcadaId <= 0
        ) {

            throw new Error(
                "Identificador da ação inválido."
            );

        }
// ==================================================
// AÇÕES — CANCELAR FINALIZAÇÃO
// ==================================================

if (
    interaction.customId.startsWith(
        "acao_finalizacao_cancelar_"
    )
) {

    try {

        const acaoMarcadaId =
            Number(
                interaction.customId.replace(
                    "acao_finalizacao_cancelar_",
                    ""
                )
            );

        if (
            !Number.isInteger(
                acaoMarcadaId
            ) ||
            acaoMarcadaId <= 0
        ) {

            await interaction.reply({

                content:
                    "❌ Identificador da ação inválido.",

                flags:
                    MessageFlags.Ephemeral

            });

            return;

        }

        await interaction.update({

            content:
`❌ **Finalização cancelada.**

A ação continua aberta normalmente.

Você pode voltar ao painel da ação e finalizar novamente quando desejar.`,

            components: []

        });

    } catch (error) {

        console.error(
            "Erro ao cancelar finalização da ação:",
            error
        );

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            await interaction.reply({

                content:
                    "❌ Não foi possível cancelar a finalização.",

                flags:
                    MessageFlags.Ephemeral

            }).catch(() => {});

        }

    }

    return;

}
        // ==========================================
        // BUSCAR PARTICIPANTES
        // ==========================================

        const participantes =
            await listarParticipantes(
                acaoMarcadaId
            );

        const participantesValidos =
            participantes.filter(
                participante =>
                    Number(
                        participante.participou
                    ) === 1
            );

        if (
            participantesValidos.length === 0
        ) {

            await interaction.editReply({
                content:
                    "❌ Não existem participantes registrados nesta ação."
            });

            apagarResposta(interaction);

            return;

        }
// ======================================================
// PERMISSÃO — ADMINISTRAÇÃO DE AÇÕES
// ======================================================

const CARGOS_ADMIN_ACOES = [
    "1530456364059721823", // Liderança
    "1535834868120948857", // Vice Liderança
    "1531838445045940296", // Resp ELITE
    "1535011230425681931"  // Elite
];

function podeAdministrarAcoes(interaction) {

    if (
        !interaction.member ||
        !interaction.member.roles
    ) {

        return false;

    }

    return CARGOS_ADMIN_ACOES.some(
        cargoId =>
            interaction.member.roles.cache.has(
                cargoId
            )
    );

}
        // ==========================================
        // BUSCAR KILLS ATUAIS
        // ==========================================

        const killsRegistradas =
            await listarKillsAcao(
                acaoMarcadaId
            );

        // ==========================================
        // CRIAR MENU NOVAMENTE
        // ==========================================

        const menu =
            criarAcaoKillsMenu(
                acaoMarcadaId,
                participantesValidos,
                killsRegistradas
            );

        await interaction.editReply({

            content:
`✏️ **CORRIGIR KILLS**

Selecione abaixo o integrante que deseja corrigir.

Os valores já registrados serão mantidos até que você altere o integrante desejado.

Depois da correção, você poderá confirmar o relatório novamente.`,

            components: [
                menu
            ]

        });

    } catch (error) {

        console.error(
            "Erro ao abrir correção de kills:",
            error
        );

        await interaction.editReply({

            content:
                `❌ Não foi possível abrir a correção de kills.\n\n` +
                `Erro: ${error.message}`

        }).catch(() => {});

        apagarResposta(
            interaction,
            15000
        );

    }

    return;

}
// ==================================================
// AÇÕES — CONFIRMAR RELATÓRIO FINAL
// ==================================================

if (
    interaction.customId.startsWith(
        "acao_relatorio_confirmar_"
    )
) {

    await interaction.deferReply({
        flags:
            MessageFlags.Ephemeral
    });

    try {

        const acaoMarcadaId =
            Number(
                interaction.customId.replace(
                    "acao_relatorio_confirmar_",
                    ""
                )
            );

        if (
            !Number.isInteger(
                acaoMarcadaId
            ) ||
            acaoMarcadaId <= 0
        ) {

            throw new Error(
                "Identificador da ação inválido."
            );

        }

        const acao =
            await buscarAcaoMarcada(
                acaoMarcadaId
            );

        if (!acao) {

            throw new Error(
                "A ação não foi encontrada."
            );

        }

        const resultado =
            await buscarResultadoAcao(
                acaoMarcadaId
            );

        if (!resultado) {

            throw new Error(
                "O resultado da ação ainda não foi registrado."
            );

        }

        const progresso =
            await obterProgressoKills(
                acaoMarcadaId
            );

        if (
            !progresso.completo
        ) {

            await interaction.editReply({

                content:
                    `❌ Ainda existem kills pendentes.\n\n` +
                    `📊 Progresso: **${progresso.preenchidos}/${progresso.total}**`

            });

            return;

        }

        const participantes =
            await listarParticipantes(
                acaoMarcadaId
            );

        const kills =
            await listarKillsAcao(
                acaoMarcadaId
            );

        const CANAL_RESULTADOS =
            "1536491000816734368";

        const canalResultados =
            interaction.guild.channels.cache.get(
                CANAL_RESULTADOS
            ) ||
            await interaction.guild.channels
                .fetch(
                    CANAL_RESULTADOS
                )
                .catch(() => null);

        if (
            !canalResultados ||
            !canalResultados.isTextBased()
        ) {

            throw new Error(
                "O canal de resultados das ações não foi encontrado."
            );

        }

        const embedResultado =
            criarAcaoResultadoEmbed({

                acao,

                resultado,

                participantes,

                kills,

                finalizadoPor:
                    interaction.user

            });

        await canalResultados.send({

            embeds: [
                embedResultado
            ]

        });

        const finalizacao =
            await finalizarAcaoMarcada({

                acaoMarcadaId,

                finalizadoPorId:
                    interaction.user.id,

                finalizadoPorNome:
                    interaction.user.username

            });

        if (
            finalizacao.status ===
            "ja_finalizada"
        ) {

            await interaction.editReply({

                content:
                    "⚠️ Essa ação já havia sido finalizada."

            });

            return;

        }

        // ==========================================
        // ATUALIZAR RESUMO DOS PVPS
        // ==========================================

        try {

            await atualizarResumoPvp(
                interaction.client
            );

        } catch (error) {

            console.error(
                "Erro ao atualizar Resumo dos PVPs:",
                error
            );

        }

        // ==========================================
        // ATUALIZAR ESTATÍSTICAS GERAIS
        // ==========================================

        try {

            await atualizarEstatisticasGerais(
                interaction.client
            );

        } catch (error) {

            console.error(
                "Erro ao atualizar Estatísticas Gerais:",
                error
            );

        }

        // ==========================================
        // APAGAR PAINEL DA AÇÃO
        // ==========================================

        if (
            acao.canalId &&
            acao.mensagemId
        ) {

            const canalAcao =
                interaction.guild.channels.cache.get(
                    acao.canalId
                ) ||
                await interaction.guild.channels
                    .fetch(
                        acao.canalId
                    )
                    .catch(() => null);

            if (
                canalAcao &&
                canalAcao.isTextBased()
            ) {

                const mensagemAcao =
                    await canalAcao.messages
                        .fetch(
                            acao.mensagemId
                        )
                        .catch(() => null);

                if (mensagemAcao) {

                    await mensagemAcao
                        .delete()
                        .catch(() => {});

                }

            }

        }

        await interaction.editReply({

            content:
`✅ **Ação finalizada com sucesso!**

🎯 **Ação:** ${acao.nomeAcao}
📌 **Resultado:** ${resultado.resultado}
💰 **Rendimento:** ${Number(
                resultado.valorRendido || 0
            ).toLocaleString(
                "pt-BR",
                {
                    style:
                        "currency",

                    currency:
                        "BRL"
                }
            )}

📢 O relatório foi enviado para ${canalResultados}.`

        });

        apagarResposta(
            interaction,
            15000
        );

    } catch (error) {

        console.error(
            "Erro ao confirmar relatório da ação:",
            error
        );

        await interaction.editReply({

            content:
                `❌ Não foi possível finalizar a ação.\n\n` +
                `Erro: ${error.message}`

        }).catch(() => {});

        apagarResposta(
            interaction,
            15000
        );

    }

    return;

}
    // ==================================================
    // CRIAR EVENTO
    // ==================================================

    if (
        interaction.customId ===
        "evento_criar"
    ) {

        return interaction.showModal(
            criarEventoPrincipalModal()
        );

    }

    // ==================================================
    // CONTINUAR CRIAÇÃO DO EVENTO
    // ==================================================

    if (
        interaction.customId ===
        "evento_continuar"
    ) {

        return interaction.showModal(
            criarEventoConfiguracaoModal()
        );

    }

    // ==================================================
    // CANCELAR CRIAÇÃO DO EVENTO
    // ==================================================

    if (
        interaction.customId ===
        "evento_cancelar_criacao"
    ) {

        removerRascunhoEvento(
            interaction.user.id
        );

        await interaction.update({

            content:
                "✅ Criação do evento cancelada.",

            embeds: [],

            components: []

        });

        return;

    }

    // ==================================================
    // PARTICIPAR DA EQUIPE DO EVENTO
    // ==================================================

    if (
        interaction.customId ===
        "evento_participar"
    ) {

        try {

            await interaction.deferReply({
                flags:
                    MessageFlags.Ephemeral
            });

            const mensagemId =
                interaction.message.id;

            const nomeExibicao =
                interaction.member?.displayName ||
                interaction.user.globalName ||
                interaction.user.username;

            const resultado =
                await adicionarParticipante({

                    mensagemId,

                    discordId:
                        interaction.user.id,

                    nome:
                        nomeExibicao

                });

            if (
                resultado.status ===
                "ja_inscrito"
            ) {

                await interaction.editReply({

                    content:
                        "⚠️ Você já está inscrito na equipe deste evento."

                });

                apagarResposta(interaction);

                return;

            }

            if (
                resultado.status ===
                "lotado"
            ) {

                await interaction.editReply({

                    content:
                        "❌ A equipe e as vagas de reserva deste evento já estão completas."

                });

                apagarResposta(interaction);

                return;

            }

            await atualizarEvento(
                interaction,
                mensagemId
            );

            const mensagemSucesso =
                resultado.status ===
                "auxiliar"
                    ? "✅ Você entrou como **Auxiliar da Equipe**."
                    : "🟡 Você entrou como **Reserva da Equipe**.";

            await interaction.editReply({

                content:
                    `${mensagemSucesso}\n\n` +
                    `📌 Sua posição na lista: **${resultado.ordem}**`

            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao participar do evento:",
                error
            );

            if (
                interaction.deferred ||
                interaction.replied
            ) {

                await interaction.editReply({

                    content:
                        "❌ Não foi possível registrar sua participação neste evento."

                }).catch(() => {});

            } else {

                await interaction.reply({

                    content:
                        "❌ Não foi possível registrar sua participação neste evento.",

                    flags:
                        MessageFlags.Ephemeral

                }).catch(() => {});

            }

            apagarResposta(interaction);

        }

        return;

    }

    // ==================================================
    // SAIR DA EQUIPE DO EVENTO
    // ==================================================

    if (
        interaction.customId ===
        "evento_sair"
    ) {

        try {

            await interaction.deferReply({
                flags:
                    MessageFlags.Ephemeral
            });

            const mensagemId =
                interaction.message.id;

            const resultado =
                await removerParticipante(
                    mensagemId,
                    interaction.user.id
                );
            if (
                resultado.status ===
                "nao_inscrito"
            ) {

                await interaction.editReply({

                    content:
                        "⚠️ Você não está inscrito na equipe deste evento."

                });

                apagarResposta(interaction);

                return;

            }

            await atualizarEvento(
                interaction,
                mensagemId
            );

            await interaction.editReply({

                content:
                    "✅ Você saiu da equipe deste evento."

            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao sair do evento:",
                error
            );

            if (
                interaction.deferred ||
                interaction.replied
            ) {

                await interaction.editReply({

                    content:
                        "❌ Não foi possível remover sua participação neste evento."

                }).catch(() => {});

            } else {

                await interaction.reply({

                    content:
                        "❌ Não foi possível remover sua participação neste evento.",

                    flags:
                        MessageFlags.Ephemeral

                }).catch(() => {});

            }

            apagarResposta(interaction);

        }

        return;

    }
// ==================================================
// REGISTRAR PARCEIRO
// ==================================================

if (
    interaction.customId ===
    "parceiro_criar"
) {

    return interaction.showModal(
        criarParceiroPrincipalModal()
    );

}

// ==================================================
// CONTINUAR RESPONSÁVEIS
// ==================================================

if (
    interaction.customId ===
    "parceiro_continuar_responsaveis"
) {

    return interaction.showModal(
        criarParceiroResponsaveisModal()
    );

}

// ==================================================
// CONTINUAR PRODUTOS
// ==================================================

if (
    interaction.customId ===
    "parceiro_continuar_produtos"
) {

    return interaction.showModal(
        criarParceiroProdutosModal()
    );

}

// ==================================================
// CONTINUAR PARA PRODUTO EXTRA
// ==================================================

if (
    interaction.customId ===
    "parceiro_continuar_produto_extra"
) {

    return interaction.showModal(
        criarParceiroProdutoExtraModal()
    );

}

// ==================================================
// CANCELAR CADASTRO
// ==================================================

if (
    interaction.customId ===
    "parceiro_cancelar"
) {

    removerRascunhoParceiro(
        interaction.user.id
    );

    await interaction.update({

        content:
            "✅ Cadastro de parceiro cancelado.",

        embeds: [],

        components: []

    });

    return;

}
    // ==================================================
    // REGISTRAR FARM
    // ==================================================

    if (
        interaction.customId ===
        "farm_registrar"
    ) {

        return interaction.showModal(
            criarFarmModal()
        );

    }

    // ==================================================
    // REGISTRO
    // ==================================================

    if (
        interaction.customId ===
        "registro"
    ) {

        return interaction.showModal(
            criarModalRegistro()
        );

    }

    // ==================================================
    // INICIAR EDITOR DE EMBEDS
    // ==================================================

    if (
        interaction.customId ===
        "embed_novo"
    ) {

        criarEditor(
            interaction.user.id
        );

        const embed =
            gerarStatusEditor(
                interaction.user.id,
                interaction.guild
            );

        if (!embed) {

            await interaction.reply({

                content:
                    "❌ Não foi possível iniciar o editor de embeds.",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        await interaction.reply({

            embeds: [embed],

            components:
                criarEditorButtons(),

            flags: 64

        });

        return;

    }
    // ==================================================
    // EDITAR TÍTULO
    // ==================================================

    if (
        interaction.customId ===
        "embed_titulo"
    ) {

        return interaction.showModal(
            criarModalTitulo()
        );

    }

    // ==================================================
    // EDITAR DESCRIÇÃO
    // ==================================================

    if (
        interaction.customId ===
        "embed_descricao"
    ) {

        return interaction.showModal(
            criarModalDescricao()
        );

    }
    // ==================================================
    // EDITAR VISUAL
    // ==================================================

    if (interaction.customId === "embed_visual") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("🎨 Visual do Embed")

            .setDescription(
                "Escolha abaixo o que deseja editar."
            )

            .setFooter({
                text: settings.mc.nome
            });

        await interaction.reply({

            embeds: [embed],

            components:
                criarVisualMenu(),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // CONFIGURAR IMAGENS
    // ==================================================

    if (interaction.customId === "embed_imagens") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("🖼 Imagens do Embed")

            .setDescription(
                "Escolha abaixo qual imagem deseja configurar."
            )

            .setFooter({
                text: settings.mc.nome
            });

        await interaction.reply({

            embeds: [embed],

            components:
                criarImagemMenu(),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // ESCOLHER CANAL
    // ==================================================

    if (interaction.customId === "embed_canal") {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("📢 Canal de Publicação")

            .setDescription(
                "Escolha o canal onde o embed será publicado."
            )

            .setFooter({
                text: settings.mc.nome
            });

        await interaction.reply({

            embeds: [embed],

            components:
                criarCanalMenu(),

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // ADICIONAR CAMPO
    // ==================================================

    if (interaction.customId === "embed_campo") {

        return interaction.showModal(
            criarModalCampo()
        );

    }

    // ==================================================
    // VISUALIZAR PRÉVIA
    // ==================================================

    if (interaction.customId === "embed_preview") {

        const previewCompleto =
            gerarPreviewCompleto(
                interaction.user.id,
                interaction.guild
            );

        if (!previewCompleto) {

            await interaction.reply({

                content:
                    "❌ Nenhum editor de embed foi encontrado.",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        await interaction.reply({

            embeds:
                previewCompleto,

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // PUBLICAR EMBED
    // ==================================================

    if (interaction.customId === "embed_publicar") {

        try {

            await publicarEmbed(
                interaction.client,
                interaction.user.id
            );

            await interaction.reply({

                content:
                    "✅ Embed publicado com sucesso.",

                flags: 64

            });

        } catch (error) {

            await interaction.reply({

                content:
                    `❌ ${error.message}`,

                flags: 64

            });

        }

        apagarResposta(interaction);

        return;

    }

    // ==================================================
    // CANCELAR EDITOR
    // ==================================================

    if (interaction.customId === "embed_cancelar") {

        removerEditor(
            interaction.user.id
        );

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERMELHO)

            .setTitle(
                "❌ Editor cancelado"
            )

            .setDescription(
                "Toda a edição do embed foi descartada."
            )

            .setFooter({
                text: settings.mc.nome
            })

            .setTimestamp();

        await interaction.update({

            embeds: [embed],

            components: []

        });

        apagarResposta(interaction);

        return;

    }
// ==================================================
// REGISTRO — APROVAR / REPROVAR
// ==================================================

if (
    interaction.customId.startsWith(
        "registro_aprovar_"
    ) ||
    interaction.customId.startsWith(
        "registro_reprovar_"
    )
) {

    const aprovando =
        interaction.customId.startsWith(
            "registro_aprovar_"
        );

    const registroId =
        interaction.customId.replace(
            aprovando
                ? "registro_aprovar_"
                : "registro_reprovar_",
            ""
        );

    await interaction.deferReply({
        flags:
            MessageFlags.Ephemeral
    });

    // ==================================================
    // FUNÇÕES DO BANCO
    // ==================================================

    const consultarRegistro =
        () => {

            return new Promise(
                (resolve, reject) => {

                    db.get(
                        `
                            SELECT *
                            FROM registrosPendentes
                            WHERE id = ?
                        `,
                        [
                            registroId
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

        };

    const executar =
        (
            sql,
            parametros = []
        ) => {

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

        };

    try {

        // ==================================================
        // BUSCAR REGISTRO
        // ==================================================

        const registro =
            await consultarRegistro();

        if (!registro) {

            await interaction.editReply({

                content:
                    "❌ Esse registro não foi encontrado."

            });

            apagarResposta(interaction);

            return;

        }

        if (
            registro.status !==
            "Pendente"
        ) {

            await interaction.editReply({

                content:
                    `⚠️ Esse registro já foi analisado.\n\n` +
                    `📌 Status atual: **${registro.status}**`

            });

            apagarResposta(interaction);

            return;

        }

        // ==================================================
        // APROVAR REGISTRO
        // ==================================================

        if (aprovando) {

            // ==============================================
            // VALIDAR CARGO SELECIONADO
            // ==============================================

            if (
                !registro.cargoSelecionadoId ||
                !registro.cargoSelecionadoNome
            ) {

                await interaction.editReply({

                    content:
                        "❌ Selecione o cargo que será concedido antes de aprovar o registro."

                });

                apagarResposta(interaction);

                return;

            }

            // ==============================================
            // BUSCAR INTEGRANTE
            // ==============================================

            const membro =
                await interaction.guild.members
                    .fetch(
                        registro.discordId
                    )
                    .catch(() => null);

            if (!membro) {

                await interaction.editReply({

                    content:
                        "❌ O integrante não foi encontrado no servidor."

                });

                apagarResposta(interaction);

                return;

            }

            // ==============================================
            // BUSCAR CARGO
            // ==============================================

            const cargo =
                interaction.guild.roles.cache.get(
                    registro.cargoSelecionadoId
                ) ||
                await interaction.guild.roles
                    .fetch(
                        registro.cargoSelecionadoId
                    )
                    .catch(() => null);

            if (!cargo) {

                await interaction.editReply({

                    content:
                        "❌ O cargo selecionado não foi encontrado no servidor."

                });

                apagarResposta(interaction);

                return;

            }

            // ==============================================
            // VALIDAR HIERARQUIA DO BOT
            // ==============================================

            const botMembro =
                interaction.guild.members.me;

            if (
                !botMembro ||
                botMembro.roles.highest.position <=
                    cargo.position
            ) {

                await interaction.editReply({

                    content:
                        `❌ O cargo do bot precisa estar acima de **${cargo.name}** na hierarquia do Discord.`

                });

                apagarResposta(interaction);

                return;

            }

            // ==============================================
            // IMPEDIR DUPLICIDADE
            // ==============================================

            const membroExistente =
                await new Promise(
                    (
                        resolve,
                        reject
                    ) => {

                        db.get(
                            `
                                SELECT discordId
                                FROM membros
                                WHERE discordId = ?
                            `,
                            [
                                registro.discordId
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

            if (membroExistente) {

                await interaction.editReply({

                    content:
                        "❌ Esse integrante já possui cadastro ativo no sistema."

                });

                apagarResposta(interaction);

                return;

            }

            // ==============================================
            // TRAVAR REGISTRO PARA EVITAR DUPLA APROVAÇÃO
            // ==============================================

            const bloqueio =
                await executar(
                    `
                        UPDATE registrosPendentes

                        SET status = 'Processando'

                        WHERE id = ?
                        AND status = 'Pendente'
                    `,
                    [
                        registroId
                    ]
                );

            if (
                bloqueio.changes === 0
            ) {

                await interaction.editReply({

                    content:
                        "⚠️ Esse registro já está sendo analisado por outra pessoa."

                });

                apagarResposta(interaction);

                return;

            }

                   let cargoAdicionado =
            false;

        let cargoAreaAdicionado =
            false;

        let cargoArea =
            null;

        let nicknameAlterado =
            false;

        const nicknameAnterior =
            membro.nickname;

        try {

            // ==========================================
            // DEFINIR CARGO DA ÁREA
            // ==========================================

            const cargosArea = {

                Elite:
                    settings.cargos.elite,

                Eventos:
                    settings.cargos.eventos,

                Farm:
                    settings.cargos.farm

            };

            const cargoAreaId =
                cargosArea[
                    registro.areaDesejada
                ];

            if (!cargoAreaId) {

                throw new Error(
                    `Não existe um cargo configurado para a área ${registro.areaDesejada}.`
                );

            }

            cargoArea =
                interaction.guild.roles.cache.get(
                    cargoAreaId
                ) ||
                await interaction.guild.roles
                    .fetch(
                        cargoAreaId
                    )
                    .catch(() => null);

            if (!cargoArea) {

                throw new Error(
                    `O cargo da área ${registro.areaDesejada} não foi encontrado no servidor.`
                );

            }

            // ==========================================
            // VALIDAR HIERARQUIA DO CARGO DE ÁREA
            // ==========================================

            if (
                botMembro.roles.highest.position <=
                cargoArea.position
            ) {

                throw new Error(
                    `O cargo do bot precisa estar acima do cargo de área **${cargoArea.name}**.`
                );

            }

            // ==========================================
// DEFINIR NICKNAME
// ==========================================

const novoNickname =
    `${registro.nome} - ${registro.idCidade}`;

if (
    novoNickname.length > 32
) {

    throw new Error(
        `O nickname "${novoNickname}" ultrapassa o limite de 32 caracteres do Discord.`
    );

}

// ==========================================
// APLICAR NICKNAME
// ==========================================

try {

    await membro.setNickname(
        novoNickname,
        `Registro aprovado por ${interaction.user.tag}`
    );

    nicknameAlterado =
        true;

} catch (error) {

    console.error(
        "Erro ao alterar nickname durante aprovação:",
        error
    );

    if (
        interaction.guild.ownerId ===
        membro.id
    ) {

        throw new Error(
            "O Discord não permite alterar o nickname do dono do servidor."
        );

    }

    throw new Error(
        "Não foi possível alterar o nickname. Verifique a permissão Gerenciar Apelidos e a posição do cargo do bot."
    );

}
            // ==========================================
            // CONCEDER CARGO PRINCIPAL
            // ==========================================

            await membro.roles.add(
                cargo,
                `Registro aprovado por ${interaction.user.tag}`
            );

            cargoAdicionado =
                true;

            // ==========================================
            // CONCEDER CARGO DA ÁREA
            // ==========================================

            if (
                cargoArea.id !==
                cargo.id
            ) {

                await membro.roles.add(
                    cargoArea,
                    `Área definida no registro: ${registro.areaDesejada}`
                );

                cargoAreaAdicionado =
                    true;

            }
                


                // ==========================================
                // SALVAR COMO INTEGRANTE
                // ==========================================

                const dataRegistro =
                    new Date().toLocaleString(
                        "pt-BR"
                    );

                await executar(
                    `
                        INSERT INTO membros (

                            discordId,
                            nome,
                            idCidade,
                            recrutador,
                            areaDesejada,
                            fazLive,
                            linkLive,
                            cargo,
                            advertencias,
                            promocoes,
                            rebaixamentos,
                            status,
                            dataRegistro,
                            ultimaPromocao,
                            ultimaAdvertencia

                        )
                        VALUES (
                            ?, ?, ?, ?, ?, ?, ?, ?,
                            0, 0, 0,
                            'Ativo',
                            ?, NULL, NULL
                        )
                    `,
                    [
                        registro.discordId,
                        registro.nome,
                        registro.idCidade,
                        registro.recrutador,
                        registro.areaDesejada,
                        registro.fazLive,
                        registro.linkLive,
                        registro.cargoSelecionadoNome,
                        dataRegistro
                    ]
                );

                // ==========================================
                // FINALIZAR SOLICITAÇÃO
                // ==========================================

                await executar(
                    `
                        UPDATE registrosPendentes

                        SET
                            status = 'Aprovado',

                            aprovadoPorId = ?,

                            aprovadoPorNome = ?,

                            resultadoEm = ?

                        WHERE id = ?
                    `,
                    [
                        interaction.user.id,
                        interaction.user.username,
                        dataRegistro,
                        registroId
                    ]
                );

           } catch (error) {

    console.error(
        "Erro durante aprovação do registro:",
        error
    );

    // ==========================================
    // ROLLBACK — CARGO DA ÁREA
    // ==========================================

    if (
        cargoAreaAdicionado &&
        cargoArea
    ) {

        await membro.roles.remove(
            cargoArea
        ).catch(() => {});

    }

    // ==========================================
    // ROLLBACK — CARGO PRINCIPAL
    // ==========================================

    if (cargoAdicionado) {

        await membro.roles.remove(
            cargo
        ).catch(() => {});

    }

    // ==========================================
    // ROLLBACK — NICKNAME
    // ==========================================

    if (nicknameAlterado) {

        await membro.setNickname(
            nicknameAnterior
        ).catch(() => {});

    }

    // ==========================================
    // ROLLBACK — BANCO DE MEMBROS
    // ==========================================

    await executar(
        `
            DELETE FROM membros
            WHERE discordId = ?
        `,
        [
            registro.discordId
        ]
    ).catch(() => {});

    // ==========================================
    // DEVOLVER REGISTRO PARA PENDENTE
    // ==========================================

    await executar(
        `
            UPDATE registrosPendentes

            SET status = 'Pendente'

            WHERE id = ?
        `,
        [
            registroId
        ]
    ).catch(() => {});

    throw error;

}

            // ==============================================
            // ATUALIZAR FICHA NO CANAL
            // ==============================================

            const embedAprovado =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERDE
                    )

                    .setTitle(
                        `✅ REGISTRO APROVADO — ${registro.nome.toUpperCase()}`
                    )

                    .setThumbnail(
                        membro.user.displayAvatarURL({
                            size: 256
                        })
                    )

                    .addFields(

                        {
                            name:
                                "👤 Nome",

                            value:
                                registro.nome,

                            inline:
                                true
                        },

                        {
                            name:
                                "🆔 ID",

                            value:
                                registro.idCidade,

                            inline:
                                true
                        },

                        {
                            name:
                                "🤝 Quem recrutou",

                            value:
                                registro.recrutador,

                            inline:
                                false
                        },

                        {
                            name:
                                "🎯 Área desejada",

                            value:
                                registro.areaDesejada,

                            inline:
                                true
                        },

                        {
                            name:
                                "📺 Faz live?",

                            value:
                                registro.fazLive
                                    ? "Sim"
                                    : "Não",

                            inline:
                                true
                        },

                        {
                            name:
                                "🔗 Canal",

                            value:
                                registro.fazLive
                                    ? registro.linkLive
                                    : "Não informado",

                            inline:
                                false
                        },

                        {
                            name:
                                "🎖 Cargo concedido",

                            value:
                                registro.cargoSelecionadoNome,

                            inline:
                                true
                        },

                        {
                            name:
                                "✅ Aprovado por",

                            value:
                                `${interaction.user}`,

                            inline:
                                true
                        },

                        {
                            name:
                                "📌 Status",

                            value:
                                "🟢 Aprovado",

                            inline:
                                false
                        }

                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Sistema de Registro`

                    })

                    .setTimestamp();

           await interaction.message.delete()
    .catch(error => {

        console.error(
            "Não foi possível apagar a ficha aprovada do canal de análise:",
            error.message
        );

    });
// ==================================================
// DM DE APROVAÇÃO
// ==================================================

await membro.send({

    embeds: [

        new EmbedBuilder()

            .setColor(
                COLORS.VERDE
            )

            .setTitle(
                "✅ Registro aprovado"
            )

            .setDescription(
                `Seu registro na **${settings.mc.nome}** foi aprovado.`
            )

            .addFields(

                {
                    name:
                        "👤 Nome",

                    value:
                        registro.nome,

                    inline:
                        true
                },

                {
                    name:
                        "🆔 ID",

                    value:
                        registro.idCidade,

                    inline:
                        true
                },

                {
                    name:
                        "🎖 Cargo recebido",

                    value:
                        registro.cargoSelecionadoNome,

                    inline:
                        true
                },

                {
                    name:
                        "🎯 Área",

                    value:
                        registro.areaDesejada,

                    inline:
                        true
                },

                {
                    name:
                        "🏷 Novo nome no Discord",

                    value:
                        `${registro.nome} - ${registro.idCidade}`,

                    inline:
                        false
                }

            )

            .setFooter({

                text:
                    settings.mc.nome

            })

            .setTimestamp()

    ]

}).catch(error => {

    console.log(
        `Não foi possível enviar DM de aprovação para ${registro.discordId}:`,
        error.message
    );

});
            

            // ==============================================
            // LOG DO REGISTRO
            // ==============================================

            const CANAL_LOGS_REGISTRO =
                "1533175931005305164";

            const canalLogs =
                interaction.guild.channels.cache.get(
                    CANAL_LOGS_REGISTRO
                ) ||
                await interaction.guild.channels
                    .fetch(
                        CANAL_LOGS_REGISTRO
                    )
                    .catch(() => null);

            if (
                canalLogs &&
                canalLogs.isTextBased()
            ) {

                const embedLog =
                    new EmbedBuilder()

                        .setColor(
                            COLORS.VERDE
                        )

                        .setTitle(
                            "✅ Registro Aprovado"
                        )

                        .setThumbnail(
                            membro.user.displayAvatarURL({
                                size: 256
                            })
                        )

                        .addFields(

                            {
                                name:
                                    "👤 Nome",

                                value:
                                    registro.nome,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🆔 ID",

                                value:
                                    registro.idCidade,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "💬 Discord",

                                value:
                                    `${membro}`,

                                inline:
                                    false
                            },

                            {
                                name:
                                    "🤝 Recrutado por",

                                value:
                                    registro.recrutador,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎯 Área desejada",

                                value:
                                    registro.areaDesejada,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📺 Live",

                                value:
                                    registro.fazLive
                                        ? registro.linkLive
                                        : "Não",

                                inline:
                                    false
                            },

                            {
                                name:
                                    "🎖 Cargo concedido",

                                value:
                                    registro.cargoSelecionadoNome,

                                inline:
                                    true
                            },
{
    name:
        "🎯 Cargo de área",

    value:
        cargoArea
            ? cargoArea.name
            : registro.areaDesejada,

    inline:
        true
},
                            {
                                name:
                                    "🛡 Aprovado por",

                                value:
                                    `${interaction.user}`,

                                inline:
                                    true
                            }

                        )

                        .setFooter({

                            text:
                                `${settings.mc.nome} • Logs de Registro`

                        })

                        .setTimestamp();

                await canalLogs.send({

                    embeds: [
                        embedLog
                    ]

                });

            }

            await interaction.editReply({

                content:
                    `✅ Registro de **${registro.nome}** aprovado.\n\n` +
                    `🎖 Cargo concedido: **${registro.cargoSelecionadoNome}**`

            });

            apagarResposta(
                interaction,
                15000
            );

            return;

        }

        // ==================================================
        // REPROVAR REGISTRO
        // ==================================================

        const resultado =
            await executar(
                `
                    UPDATE registrosPendentes

                    SET
                        status = 'Reprovado',

                        aprovadoPorId = ?,

                        aprovadoPorNome = ?,

                        resultadoEm = ?

                    WHERE id = ?
                    AND status = 'Pendente'
                `,
                [
                    interaction.user.id,
                    interaction.user.username,
                    new Date().toLocaleString(
                        "pt-BR"
                    ),
                    registroId
                ]
            );

        if (
            resultado.changes === 0
        ) {

            await interaction.editReply({

                content:
                    "⚠️ Esse registro já foi analisado por outra pessoa."

            });

            apagarResposta(interaction);

            return;

        }

        const usuario =
            await interaction.client.users
                .fetch(
                    registro.discordId
                )
                .catch(() => null);

        const embedReprovado =
            new EmbedBuilder()

                .setColor(
                    COLORS.VERMELHO
                )

                .setTitle(
                    `❌ REGISTRO REPROVADO — ${registro.nome.toUpperCase()}`
                )

                .addFields(

                    {
                        name:
                            "👤 Nome",

                        value:
                            registro.nome,

                        inline:
                            true
                    },

                    {
                        name:
                            "🆔 ID",

                        value:
                            registro.idCidade,

                        inline:
                            true
                    },

                    {
                        name:
                            "🤝 Quem recrutou",

                        value:
                            registro.recrutador,

                        inline:
                            false
                    },

                    {
                        name:
                            "🎯 Área desejada",

                        value:
                            registro.areaDesejada,

                        inline:
                            true
                    },

                    {
                        name:
                            "📺 Live",

                        value:
                            registro.fazLive
                                ? registro.linkLive
                                : "Não",

                        inline:
                            true
                    },

                    {
                        name:
                            "❌ Reprovado por",

                        value:
                            `${interaction.user}`,

                        inline:
                            false
                    },

                    {
                        name:
                            "📌 Status",

                        value:
                            "🔴 Reprovado",

                        inline:
                            false
                    }

                )

                .setFooter({

                    text:
                        `${settings.mc.nome} • Sistema de Registro`

                })

                .setTimestamp();

       await interaction.message.delete()
    .catch(error => {

        console.error(
            "Não foi possível apagar a ficha reprovada do canal de análise:",
            error.message
        );

    });

        // ==================================================
        // DM DE REPROVAÇÃO
        // ==================================================

        if (usuario) {

            await usuario.send({

                embeds: [

                    new EmbedBuilder()

                        .setColor(
                            COLORS.VERMELHO
                        )

                        .setTitle(
                            "❌ Registro reprovado"
                        )

                        .setDescription(
                            `Seu registro na **${settings.mc.nome}** foi reprovado.`
                        )

                        .setFooter({

                            text:
                                settings.mc.nome

                        })

                        .setTimestamp()

                ]

            }).catch(error => {

                console.log(
                    `Não foi possível enviar DM para ${registro.discordId}:`,
                    error.message
                );

            });

        }

        // ==================================================
        // LOG DA REPROVAÇÃO
        // ==================================================

        const CANAL_LOGS_REGISTRO =
            "1533175931005305164";

        const canalLogs =
            interaction.guild.channels.cache.get(
                CANAL_LOGS_REGISTRO
            ) ||
            await interaction.guild.channels
                .fetch(
                    CANAL_LOGS_REGISTRO
                )
                .catch(() => null);

        if (
            canalLogs &&
            canalLogs.isTextBased()
        ) {

            await canalLogs.send({

                embeds: [
                    embedReprovado
                ]

            });

        }

        await interaction.editReply({

            content:
                `❌ Registro de **${registro.nome}** reprovado.`

        });

        apagarResposta(
            interaction,
            15000
        );

    } catch (error) {

        console.error(
            "Erro ao analisar registro:",
            error
        );

        await interaction.editReply({

            content:
                `❌ Não foi possível concluir a análise do registro.\n\n` +
                `Erro: ${error.message}`

        }).catch(() => {});

        apagarResposta(
            interaction,
            15000
        );

    }

    return;

}

}

module.exports = {
    handleButton
};