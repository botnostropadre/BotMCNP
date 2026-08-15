const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

const {
    registrar
} = require("../services/registroService");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

const {
    atualizarEditor,
    adicionarCampo
} = require("../services/embedBuilderService");

const {
    gerarStatusEditor
} = require("../services/embedStatusService");

const {
    criarEditorButtons
} = require("../buttons/embedEditorButtons");

const {
    handleParceiroPrincipal
} = require("./parceiros/handleParceiroPrincipal");
const {
    editarParceiro
} = require("../services/parceiroService");

const {
    atualizarParceiros
} = require("../services/atualizarParceiros");

// ======================================================
// SISTEMA DE AÇÕES
// ======================================================

const {
    registrarResultadoAcao,
    buscarAcaoMarcada,
    listarParticipantes,
    registrarKillsParticipante,
    listarKillsAcao,
    obterProgressoKills
} = require("../services/acaoService");

const {
    criarAcaoKillsMenu
} = require("../selectMenus/acaoKillsMenu");

// ======================================================
// SISTEMA DE EVENTOS
// ======================================================

const {
    criarRascunhoEvento,
    obterRascunhoEvento,
    removerRascunhoEvento
} = require("../services/eventoBuilderService");

const {
    salvarEvento
} = require("../services/eventoService");

const {
    criarEventoEmbed
} = require("../embeds/eventoEmbed");

const {
    criarEventoParticipacaoButtons
} = require("../buttons/eventoParticipacaoButtons");
// ======================================================
// SISTEMA DE FARM
// ======================================================

const {
    registrarFarm,
    obterPainelMembro,
    salvarPainelMembro
} = require("../services/farmService");

const {
    criarFarmEmbed
} = require("../embeds/farmEmbed");

// ======================================================
// APAGAR RESPOSTA APÓS 10 SEGUNDOS
// ======================================================

function apagarResposta(
    interaction,
    tempo = 10000
) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {

            // A resposta pode já ter sido apagada.

        }

    }, tempo);

}

// ======================================================
// APAGAR MENSAGEM TEMPORÁRIA
// ======================================================

function apagarMensagem(
    mensagem,
    tempo = 10000
) {

    setTimeout(async () => {

        try {

            await mensagem.delete();

        } catch {

            // A mensagem pode já ter sido apagada.

        }

    }, tempo);

}

// ======================================================
// ATUALIZAR PAINEL DO EDITOR
// ======================================================

async function atualizarPainelEditor(
    interaction,
    mensagemSucesso
) {

    const painel = gerarStatusEditor(
        interaction.user.id,
        interaction.guild
    );

    if (!painel) {

        await interaction.reply({

            content:
                "❌ Nenhum editor de embed foi encontrado.",

            flags:
                MessageFlags.Ephemeral

        });

        apagarResposta(interaction);

        return;

    }

    /*
     * Quando o modal foi aberto por um botão ou menu,
     * interaction.message representa o painel original.
     */

    if (interaction.message) {

        await interaction.update({

            embeds: [painel],

            components:
                criarEditorButtons()

        });

    } else {

        await interaction.reply({

            embeds: [painel],

            components:
                criarEditorButtons(),

            flags:
                MessageFlags.Ephemeral

        });

    }

    const confirmacao =
        await interaction.followUp({

            content:
                mensagemSucesso,

            flags:
                MessageFlags.Ephemeral

        });

    apagarMensagem(confirmacao);

}
    
// ======================================================
// HANDLER DE MODAIS
// ======================================================

async function handleModal(interaction) {

    if (!interaction.isModalSubmit()) return;

// ======================================================
// PARCEIROS — SALVAR EDIÇÃO
// ======================================================

if (
    interaction.isModalSubmit() &&
    interaction.customId.startsWith(
        "parceiro_editar_modal_"
    )
) {

    await interaction.deferReply({
        flags:
            MessageFlags.Ephemeral
    });

    try {

        const parceiroId =
            Number(
                interaction.customId.replace(
                    "parceiro_editar_modal_",
                    ""
                )
            );

        if (
            !Number.isInteger(
                parceiroId
            ) ||
            parceiroId <= 0
        ) {

            throw new Error(
                "Identificador do parceiro inválido."
            );

        }

        const nomeFaccao =
            interaction.fields
                .getTextInputValue(
                    "parceiro_editar_nome"
                )
                .trim();

        const produto =
            interaction.fields
                .getTextInputValue(
                    "parceiro_editar_produto"
                )
                .trim();

        const descricao =
            interaction.fields
                .getTextInputValue(
                    "parceiro_editar_descricao"
                )
                .trim();

        const salaDarkChat =
            interaction.fields
                .getTextInputValue(
                    "parceiro_editar_sala"
                )
                .trim();

        const senhaSala =
            interaction.fields
                .getTextInputValue(
                    "parceiro_editar_senha"
                )
                .trim();

        const parceiro =
            await editarParceiro(
                parceiroId,
                {
                    nomeFaccao,
                    produto,
                    descricao,
                    salaDarkChat,
                    senhaSala
                }
            );

        try {

            await atualizarParceiros(
                interaction.client
            );

        } catch (error) {

            console.error(
                "Parceiro editado, mas ocorreu erro ao atualizar o painel:",
                error
            );

        }

        await interaction.editReply({

            content:
`✅ **Parceiro atualizado com sucesso!**

🏛️ **FAC:** ${parceiro.nomeFaccao}

📦 **Produto:** ${parceiro.produto}

💬 **Sala Dark Chat:** ${parceiro.salaDarkChat}

🔐 **Senha:** ${parceiro.senhaSala}

📊 O painel de parceiros foi atualizado automaticamente.`

        });

    } catch (error) {

        console.error(
            "Erro ao editar parceiro:",
            error
        );

        await interaction.editReply({

            content:
                `❌ Não foi possível editar o parceiro.\n\n` +
                `Erro: ${error.message}`

        }).catch(
            () => {}
        );

    }

    return true;

}

// ==================================================
// AÇÕES — REGISTRAR KILLS DO PARTICIPANTE
// ==================================================

if (
    interaction.customId.startsWith(
        "acao_kills_modal_"
    )
) {

    await interaction.deferReply({
        flags:
            MessageFlags.Ephemeral
    });

    try {

        // ==========================================
        // EXTRAIR IDs
        // ==========================================

        const dadosId =
            interaction.customId.replace(
                "acao_kills_modal_",
                ""
            );

        const separador =
            dadosId.indexOf("_");

        if (
            separador === -1
        ) {

            throw new Error(
                "Identificador do participante inválido."
            );

        }

        const acaoMarcadaId =
            Number(
                dadosId.substring(
                    0,
                    separador
                )
            );

        const discordId =
            dadosId.substring(
                separador + 1
            );

        if (
            !Number.isInteger(
                acaoMarcadaId
            ) ||
            acaoMarcadaId <= 0 ||
            !discordId
        ) {

            throw new Error(
                "Ação ou participante inválido."
            );

        }

        // ==========================================
        // KILLS
        // ==========================================

        const killsTexto =
            interaction.fields
                .getTextInputValue(
                    "kills"
                )
                .trim();

        const kills =
            Number(
                killsTexto
            );

        if (
            !Number.isInteger(
                kills
            ) ||
            kills < 0 ||
            kills > 999
        ) {

            await interaction.editReply({

                content:
                    "❌ Informe uma quantidade válida de kills.\n\n" +
                    "Use somente números inteiros de **0 a 999**."

            });

            apagarResposta(interaction);

            return;

        }

        // ==========================================
        // BUSCAR PARTICIPANTE
        // ==========================================

        const participantes =
            await listarParticipantes(
                acaoMarcadaId
            );

        const participante =
            participantes.find(
                item =>
                    item.discordId ===
                    discordId
            );

        if (!participante) {

            await interaction.editReply({

                content:
                    "❌ Esse participante não pertence mais à ação."

            });

            apagarResposta(interaction);

            return;

        }

        // ==========================================
        // SALVAR KILLS
        // ==========================================

        await registrarKillsParticipante({

            acaoMarcadaId,

            discordId,

            nome:
                participante.nome,

            kills

        });

        // ==========================================
        // PROGRESSO
        // ==========================================

        const progresso =
            await obterProgressoKills(
                acaoMarcadaId
            );

        const killsRegistradas =
            await listarKillsAcao(
                acaoMarcadaId
            );

        // ==========================================
        // TODOS PREENCHIDOS
        // ==========================================

        if (
            progresso.completo
        ) {

            const ranking =
                killsRegistradas

                    .map(
                        (registro, indice) =>
                            `${indice + 1}. <@${registro.discordId}> — **${registro.kills} kill(s)**`
                    )

                    .join("\n");

            const botoes =
                new ActionRowBuilder()

                    .addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                `acao_relatorio_confirmar_${acaoMarcadaId}`
                            )

                            .setLabel(
                                "Confirmar Relatório"
                            )

                            .setEmoji(
                                "✅"
                            )

                            .setStyle(
                                ButtonStyle.Success
                            ),

                        new ButtonBuilder()

                            .setCustomId(
                                `acao_kills_editar_${acaoMarcadaId}`
                            )

                            .setLabel(
                                "Corrigir Kills"
                            )

                            .setEmoji(
                                "✏️"
                            )

                            .setStyle(
                                ButtonStyle.Secondary
                            )

                    );

            await interaction.editReply({

                content:
`💀 **KILLS REGISTRADAS**

✅ **${participante.nome}: ${kills} kill(s)**

📊 **Progresso: ${progresso.preenchidos}/${progresso.total}**

Todos os participantes foram preenchidos.

### 🏆 Ranking da ação

${ranking || "Nenhuma kill registrada."}

Confira os dados antes de gerar o relatório definitivo.`,

                components: [
                    botoes
                ]

            });

            return;

        }

        // ==========================================
        // AINDA EXISTEM PENDENTES
        // ==========================================

        const menu =
            criarAcaoKillsMenu(
                acaoMarcadaId,
                participantes,
                killsRegistradas
            );

        const pendentesTexto =
            progresso.pendentes

                .map(
                    participantePendente =>
                        `• ${participantePendente.nome}`
                )

                .join("\n");

        await interaction.editReply({

            content:
`✅ **Kills registradas!**

👤 **Integrante:** ${participante.nome}
💀 **Kills:** ${kills}

📊 **Progresso:** ${progresso.preenchidos}/${progresso.total}

### ⏳ Ainda faltam

${pendentesTexto}

Selecione o próximo integrante abaixo:`,

            components: [
                menu
            ]

        });

    } catch (error) {

        console.error(
            "Erro ao registrar kills:",
            error
        );

        await interaction.editReply({

            content:
                `❌ Não foi possível registrar as kills.\n\n` +
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
// AÇÕES — PRIMEIRA ETAPA DA FINALIZAÇÃO
// ==================================================

if (
    interaction.customId.startsWith(
        "acao_finalizar_modal_"
    )
) {

    await interaction.deferReply({
        flags:
            MessageFlags.Ephemeral
    });

    try {

        // ==========================================
        // IDENTIFICAR AÇÃO
        // ==========================================

        const acaoMarcadaId =
            Number(
                interaction.customId.replace(
                    "acao_finalizar_modal_",
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

        // ==========================================
        // RESULTADO
        // ==========================================

        const resultadoTexto =
            interaction.fields
                .getTextInputValue(
                    "resultado"
                )
                .trim()
                .toLowerCase();

        let resultadoFinal;

        if (
            [
                "vitoria",
                "vitória",
                "ganhou",
                "ganhamos",
                "win"
            ].includes(
                resultadoTexto
            )
        ) {

            resultadoFinal =
                "Vitória";

        } else if (
            [
                "derrota",
                "perdeu",
                "perdemos",
                "loss"
            ].includes(
                resultadoTexto
            )
        ) {

            resultadoFinal =
                "Derrota";

        } else {

            await interaction.editReply({

                content:
                    "❌ Resultado inválido.\n\n" +
                    "Informe apenas **Vitória** ou **Derrota**."

            });

            apagarResposta(interaction);

            return;

        }

        // ==========================================
        // VALOR
        // ==========================================

        const valorTexto =
            interaction.fields
                .getTextInputValue(
                    "valor"
                )
                .trim();

        let valorLimpo =
            valorTexto
                .replace(
                    /R\$/gi,
                    ""
                )
                .replace(
                    /\s/g,
                    ""
                );

        // ==========================================
        // TRATAR FORMATAÇÃO BRASILEIRA
        // ==========================================

        if (
            valorLimpo.includes(",")
        ) {

            valorLimpo =
                valorLimpo
                    .replace(
                        /\./g,
                        ""
                    )
                    .replace(
                        ",",
                        "."
                    );

        } else {

            valorLimpo =
                valorLimpo.replace(
                    /[^0-9.-]/g,
                    ""
                );

        }

        const valorRendido =
            Number(
                valorLimpo
            );

        if (
            !Number.isFinite(
                valorRendido
            ) ||
            valorRendido < 0
        ) {

            await interaction.editReply({

                content:
                    "❌ Informe um valor válido para o rendimento da ação.\n\n" +
                    "Exemplo: **1500000**"

            });

            apagarResposta(interaction);

            return;

        }

        // ==========================================
        // OBSERVAÇÕES
        // ==========================================

        let observacoes =
            "";

        try {

            observacoes =
                interaction.fields
                    .getTextInputValue(
                        "observacoes"
                    )
                    .trim();

        } catch {

            observacoes =
                "";

        }

        // ==========================================
        // BUSCAR AÇÃO
        // ==========================================

        const acao =
            await buscarAcaoMarcada(
                acaoMarcadaId
            );

        if (!acao) {

            await interaction.editReply({

                content:
                    "❌ Essa ação não foi encontrada."

            });

            apagarResposta(interaction);

            return;

        }

        if (
            acao.status !==
            "Aberta"
        ) {

            await interaction.editReply({

                content:
                    "⚠️ Essa ação já foi encerrada ou não está mais disponível."

            });

            apagarResposta(interaction);

            return;

        }

        // ==========================================
        // PARTICIPANTES
        // ==========================================

        const participantes =
            await listarParticipantes(
                acaoMarcadaId
            );

        const participantesReais =
            participantes.filter(
                participante =>
                    Number(
                        participante.participou
                    ) === 1
            );

        if (
            participantesReais.length === 0
        ) {

            await interaction.editReply({

                content:
                    "❌ Não existem participantes titulares registrados nessa ação."

            });

            apagarResposta(interaction);

            return;

        }

        // ==========================================
        // SALVAR RESULTADO
        // ==========================================

        const resultadoSalvo =
            await registrarResultadoAcao({

                acaoMarcadaId,

                resultado:
                    resultadoFinal,

                valorRendido,

                observacoes,

                registradoPorId:
                    interaction.user.id,

                registradoPorNome:
                    interaction.user.username

            });

        if (
            resultadoSalvo.status ===
            "ja_finalizada"
        ) {

            await interaction.editReply({

                content:
                    "⚠️ Essa ação já foi finalizada."

            });

            apagarResposta(interaction);

            return;

        }

        // ==========================================
        // BOTÕES
        // ==========================================

        const botoes =
            new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId(
                            `acao_kills_iniciar_${acaoMarcadaId}`
                        )

                        .setLabel(
                            "Registrar Kills"
                        )

                        .setEmoji(
                            "💀"
                        )

                        .setStyle(
                            ButtonStyle.Primary
                        ),

                    new ButtonBuilder()

                        .setCustomId(
                            `acao_finalizacao_cancelar_${acaoMarcadaId}`
                        )

                        .setLabel(
                            "Cancelar"
                        )

                        .setEmoji(
                            "❌"
                        )

                        .setStyle(
                            ButtonStyle.Danger
                        )

                );

        // ==========================================
        // RESPOSTA
        // ==========================================

        await interaction.editReply({

            content:
`✅ **Resultado da ação salvo.**

🎯 **Ação:** ${acao.nomeAcao}
🏆 **Resultado:** ${resultadoFinal}

💰 **Rendimento:** ${valorRendido.toLocaleString(
                "pt-BR",
                {
                    style:
                        "currency",

                    currency:
                        "BRL"
                }
            )}

👥 **Participantes:** ${participantesReais.length}

${observacoes
    ? `📝 **Observações:** ${observacoes}\n\n`
    : ""
}Agora precisamos registrar as **kills de cada participante** antes de concluir a ação.`,

            components: [
                botoes
            ]

        });

    } catch (error) {

        console.error(
            "Erro ao registrar resultado da ação:",
            error
        );

        await interaction.editReply({

            content:
                `❌ Não foi possível registrar o resultado da ação.\n\n` +
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
    // SISTEMA DE PARCEIROS
    // ==================================================

    if (
        await handleParceiroPrincipal(
            interaction
        )
    ) {

        return;

    }
  

    // ==================================================
    // EVENTO — PRIMEIRA ETAPA
    // ==================================================

    if (
        interaction.customId ===
        "evento_modal_principal"
    ) {

        const nome =
            interaction.fields
                .getTextInputValue(
                    "evento_nome"
                )
                .trim();

        const descricao =
            interaction.fields
                .getTextInputValue(
                    "evento_descricao"
                )
                .trim();

        const dataHora =
            interaction.fields
                .getTextInputValue(
                    "evento_data_hora"
                )
                .trim();

        const traje =
            interaction.fields
                .getTextInputValue(
                    "evento_traje"
                )
                .trim();

        const responsavel =
            interaction.fields
                .getTextInputValue(
                    "evento_responsavel"
                )
                .trim();

        try {

            criarRascunhoEvento(
                interaction.user.id,
                {
                    nome,
                    descricao,
                    dataHora,
                    traje,
                    responsavel
                }
            );

            const botoes =
                new ActionRowBuilder()

                    .addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                "evento_continuar"
                            )

                            .setLabel(
                                "Continuar Configuração"
                            )

                            .setEmoji("➡️")

                            .setStyle(
                                ButtonStyle.Success
                            ),

                        new ButtonBuilder()

                            .setCustomId(
                                "evento_cancelar_criacao"
                            )

                            .setLabel(
                                "Cancelar"
                            )

                            .setEmoji("❌")

                            .setStyle(
                                ButtonStyle.Danger
                            )

                    );

            await interaction.reply({

                content:
`✅ Informações principais salvas.

**Evento:** ${nome}

Clique em **Continuar Configuração** para informar:

👥 Quantidade de auxiliares  
🖼️ Flyer do evento`,

                components:
                    [botoes],

                flags:
                    MessageFlags.Ephemeral

            });

        } catch (error) {

            console.error(
                "Erro ao salvar primeira etapa do evento:",
                error
            );

            await interaction.reply({

                content:
                    "❌ Não foi possível salvar as informações do evento.",

                flags:
                    MessageFlags.Ephemeral

            });

            apagarResposta(interaction);

        }

        return;

    }
    // ==================================================
    // EVENTO — SEGUNDA ETAPA
    // ==================================================

    if (
        interaction.customId ===
        "evento_modal_configuracao"
    ) {

        const quantidadeTexto =
            interaction.fields
                .getTextInputValue(
                    "evento_quantidade"
                )
                .trim();

        const flyer =
            interaction.fields
                .getTextInputValue(
                    "evento_flyer"
                )
                .trim();

        const quantidadeAuxiliares =
            Number(quantidadeTexto);

        if (
            !Number.isInteger(quantidadeAuxiliares) ||
            quantidadeAuxiliares < 1 ||
            quantidadeAuxiliares > 50
        ) {

            await interaction.reply({

                content:
                    "❌ A quantidade de auxiliares deve ser um número inteiro entre 1 e 50.",

                flags:
                    MessageFlags.Ephemeral

            });

            apagarResposta(interaction);

            return;

        }

        try {

            const urlFlyer =
                new URL(flyer);

            if (
                ![
                    "http:",
                    "https:"
                ].includes(urlFlyer.protocol)
            ) {

                throw new Error(
                    "URL inválida."
                );

            }

        } catch {

            await interaction.reply({

                content:
                    "❌ Informe uma URL válida para o flyer.",

                flags:
                    MessageFlags.Ephemeral

            });

            apagarResposta(interaction);

            return;

        }

        const rascunho =
            obterRascunhoEvento(
                interaction.user.id
            );

        if (!rascunho) {

            await interaction.reply({

                content:
                    "❌ O rascunho do evento expirou ou não foi encontrado.",

                flags:
                    MessageFlags.Ephemeral

            });

            apagarResposta(interaction);

            return;

        }

        const CANAL_EVENTOS =
            "1534336370460332093";

        try {

            await interaction.deferReply({

                flags:
                    MessageFlags.Ephemeral

            });

            const canalEventos =
                interaction.guild.channels.cache.get(
                    CANAL_EVENTOS
                ) ||
                await interaction.guild.channels
                    .fetch(CANAL_EVENTOS)
                    .catch(() => null);

            if (
                !canalEventos ||
                !canalEventos.isTextBased()
            ) {

                throw new Error(
                    "O canal de eventos não foi encontrado."
                );

            }

            const dadosEvento = {

                nome:
                    rascunho.nome,

                descricao:
                    rascunho.descricao,

                dataHora:
                    rascunho.dataHora,

                traje:
                    rascunho.traje,

                responsavel:
                    rascunho.responsavel,

                quantidadeAuxiliares,

                flyer,

                criadoPor:
                    interaction.user.id,

                dataCriacao:
                    new Date().toLocaleString(
                        "pt-BR"
                    )

            };

            const mensagemEvento =
                await canalEventos.send({

                    embeds: [

                        criarEventoEmbed({

                            evento:
                                dadosEvento,

                            auxiliares:
                                [],

                            reservas:
                                []

                        })

                    ],

                    components:
                        criarEventoParticipacaoButtons()

                });

            await salvarEvento({

                ...dadosEvento,

                mensagemId:
                    mensagemEvento.id

            });

            removerRascunhoEvento(
                interaction.user.id
            );

            await interaction.editReply({

                content:
                    `✅ Evento criado com sucesso.\n\n` +
                    `📅 Evento: **${rascunho.nome}**\n` +
                    `📢 Canal: ${canalEventos}\n` +
                    `👥 Auxiliares: **${quantidadeAuxiliares}**\n` +
                    `🟡 Reservas: **2**`

            });

            apagarResposta(
                interaction,
                15000
            );

        } catch (error) {

            console.error(
                "Erro ao publicar evento:",
                error
            );

            const mensagemErro =
                error.message ||
                "Não foi possível publicar o evento.";

            if (
                interaction.deferred ||
                interaction.replied
            ) {

                await interaction.editReply({

                    content:
                        `❌ ${mensagemErro}`

                }).catch(() => {});

            } else {

                await interaction.reply({

                    content:
                        `❌ ${mensagemErro}`,

                    flags:
                        MessageFlags.Ephemeral

                }).catch(() => {});

            }

            apagarResposta(interaction);

        }

        return;

    }
    // ==================================================
    // REGISTRO DE FARM
    // ==================================================

    if (
        interaction.customId ===
        "farm_modal_registro"
    ) {

        const dados =
    interaction.fields
        .getTextInputValue("farm_tijolos")
        .trim();

const dinheiroSujo =
    interaction.fields
        .getTextInputValue("farm_materiais")
        .trim();

        const CATEGORIA_PLANILHAS =
            "1533146414576566292";

        try {

            await interaction.deferReply({
                flags:
                    MessageFlags.Ephemeral
            });

            const nomeExibicao =
                interaction.member.displayName;

            const resumo =
    await registrarFarm({

        discordId:
            interaction.user.id,

        tijolos:
            dados,

        materiais:
            dinheiroSujo

    });

            let painel =
                await obterPainelMembro(
                    interaction.user.id
                );

            let canal = null;

            // ==========================================
            // LOCALIZAR CANAL EXISTENTE
            // ==========================================

            if (painel?.canalId) {

                canal =
                    interaction.guild.channels.cache.get(
                        painel.canalId
                    );

            }

            // ==========================================
            // CRIAR CANAL INDIVIDUAL
            // ==========================================

            if (!canal) {

                const nomeCanal = nomeExibicao

                    .toLowerCase()

                    .normalize("NFD")

                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )

                    .replace(
                        /[^a-z0-9-]/g,
                        "-"
                    )

                    .replace(
                        /-+/g,
                        "-"
                    )

                    .replace(
                        /^-|-$/g,
                        ""
                    )

                    .slice(0, 90) ||
                    `farm-${interaction.user.id}`;

                canal =
                    await interaction.guild.channels.create({

                        name:
                            nomeCanal,

                        type:
                            0,

                        parent:
                            CATEGORIA_PLANILHAS,

                        topic:
                            `Planilha de farm de ${nomeExibicao} • ${settings.mc.nome}`

                    });

            }

            const embed =
                criarFarmEmbed(
                    nomeExibicao,
                    resumo
                );

            let mensagem = null;

            // ==========================================
            // LOCALIZAR MENSAGEM EXISTENTE
            // ==========================================

            if (
                painel?.mensagemId &&
                canal.isTextBased()
            ) {

                mensagem =
                    await canal.messages.fetch(
                        painel.mensagemId
                    ).catch(() => null);

            }

            // ==========================================
            // ATUALIZAR OU CRIAR EMBED
            // ==========================================

            if (mensagem) {

                await mensagem.edit({
                    embeds: [embed]
                });

            } else {

                mensagem =
                    await canal.send({
                        embeds: [embed]
                    });

                try {

                    await mensagem.pin();

                } catch {}

            }

            // ==========================================
            // SALVAR PAINEL DO INTEGRANTE
            // ==========================================

            await salvarPainelMembro({

                discordId:
                    interaction.user.id,

                nomeExibicao,

                canalId:
                    canal.id,

                mensagemId:
                    mensagem.id

            });
            // ==========================================
            // LOG DO FARM
            // ==========================================

            try {

                const canalLogs =
                    interaction.guild.channels.cache.get(
                        "1530680762259476672"
                    );

                if (
                    canalLogs &&
                    canalLogs.isTextBased()
                ) {

                    const {
                        EmbedBuilder
                    } = require("discord.js");

                    const embedLog =
                        new EmbedBuilder()

                            .setColor(COLORS.VERDE)

                            .setTitle(
                                "📦 Novo Registro de Farm"
                            )

                            .addFields(

                                {
                                    name:
                                        "👤 Integrante",

                                    value:
                                        `${interaction.user}`,

                                    inline:
                                        false
                                },

                           {
    name:
        "💳 Dados",

    value:
        dados || "0",

    inline:
        true
},
{
    name:
        "💵 Dinheiro Sujo",

    value:
        Number(
            dinheiroSujo || 0
        ).toLocaleString(
            "pt-BR",
            {
                style:
                    "currency",

                currency:
                    "BRL",

                maximumFractionDigits:
                    0
            }
        ),

    inline:
        true
},

                                {
                                    name:
                                        "📁 Planilha",

                                    value:
                                        `${canal}`,

                                    inline:
                                        false
                                }

                            )

                            .setFooter({

                                text:
                                    `${settings.mc.nome} • Registro de Farm`

                            })

                            .setTimestamp();

                    await canalLogs.send({

                        embeds: [
                            embedLog
                        ]

                    });

                }

            } catch (erroLog) {

                console.error(
                    "Erro ao enviar log de farm:",
                    erroLog
                );

            }

            // ==========================================
            // HISTÓRICO DO FARM
            // ==========================================

            try {

                const {
                    EmbedBuilder
                } = require("discord.js");

                const embedHistorico =
                    new EmbedBuilder()

                        .setColor(COLORS.VERDE)

                        .setTitle(
                            "📦 Registro de Farm"
                        )

                        .setDescription(
                            "Novo lançamento registrado."
                        )

                        .addFields(

                            {
    name:
        "💳 Dados",

    value:
        `+${dados || "0"} unidades`,

    inline:
        true
},
{
    name:
        "💵 Dinheiro Sujo",

    value:
        `+${Number(
            dinheiroSujo || 0
        ).toLocaleString(
            "pt-BR",
            {
                style:
                    "currency",

                currency:
                    "BRL",

                maximumFractionDigits:
                    0
            }
        )}`,

    inline:
        true
},

                            {
                                name:
                                    "👤 Registrado por",

                                value:
                                    `${interaction.user}`,

                                inline:
                                    false
                            }

                        )

                        .setFooter({

                            text:
                                `${settings.mc.nome} • Histórico de Farm`

                        })

                        .setTimestamp();

                await canal.send({

                    embeds: [
                        embedHistorico
                    ]

                });

            } catch (erroHistorico) {

                console.error(
                    "Erro ao enviar histórico de farm:",
                    erroHistorico
                );

            }

            await interaction.editReply({

                content:
                    `✅ Farm registrado com sucesso.\n\n` +
                    `📁 Planilha: ${canal}`

            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao registrar farm:",
                error
            );

            const mensagemErro =
                `❌ ${
                    error.message ||
                    "Não foi possível registrar o farm."
                }`;

            if (
                interaction.deferred ||
                interaction.replied
            ) {

                await interaction.editReply({

                    content:
                        mensagemErro

                }).catch(() => {});

            } else {

                await interaction.reply({

                    content:
                        mensagemErro,

                    flags:
                        64

                }).catch(() => {});

            }

            apagarResposta(interaction);

        }

        return;

    }

    // ==================================================
    // FINANCEIRO — ENTRADA E SAÍDA
    // ==================================================

    if (
        interaction.customId.startsWith(
            "financeiro_entrada_"
        ) ||
        interaction.customId.startsWith(
            "financeiro_saida_"
        )
    ) {

        const tipo =
            interaction.customId.startsWith(
                "financeiro_entrada_"
            )
                ? "entrada"
                : "saida";

        const categoria =
            interaction.customId.replace(
                `financeiro_${tipo}_`,
                ""
            );

        const valorTexto =
            interaction.fields
                .getTextInputValue("valor");

        const valor = Number(

            valorTexto
                .replace(/\./g, "")
                .replace(",", ".")

        );

        const descricao =
            interaction.fields
                .getTextInputValue(
                    "descricao"
                );

        if (
            !Number.isFinite(valor) ||
            valor <= 0
        ) {

            await interaction.reply({

                content:
                    "❌ Informe um valor válido.",

                flags:
                    64

            });

            apagarResposta(interaction);

            return;

        }

        try {

            if (tipo === "entrada") {

                await registrarEntrada(

                    valor,

                    categoria,

                    descricao,

                    interaction.user.username

                );

            } else {

                await registrarSaida(

                    valor,

                    categoria,

                    descricao,

                    interaction.user.username

                );

            }

            await atualizarPainelFinanceiro(
                interaction.client
            );

            const canalLogs =
                interaction.guild.channels.cache.get(
                    settings.canais.logs
                );

            if (
                canalLogs &&
                canalLogs.isTextBased()
            ) {

                await canalLogs.send({

                    embeds: [

                        {

                            color:
                                tipo === "entrada"
                                    ? COLORS.VERDE
                                    : COLORS.VERMELHO,

                            title:
                                tipo === "entrada"
                                    ? "📥 Nova Entrada Financeira"
                                    : "📤 Nova Saída Financeira",

                            fields: [

                                {

                                    name:
                                        "💵 Valor",

                                    value:
                                        valor.toLocaleString(
                                            "pt-BR",
                                            {
                                                style:
                                                    "currency",

                                                currency:
                                                    "BRL"
                                            }
                                        ),

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "📂 Categoria",

                                    value:
                                        categoria,

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "📝 Descrição",

                                    value:
                                        descricao ||
                                        "Nenhuma descrição informada.",

                                    inline:
                                        false

                                },

                                {

                                    name:
                                        "👤 Responsável",

                                    value:
                                        `${interaction.user}`,

                                    inline:
                                        false

                                }

                            ],

                            footer: {

                                text:
                                    `${settings.mc.nome} • Sistema Financeiro`

                            },

                            timestamp:
                                new Date().toISOString()

                        }

                    ]

                });

            }

            await interaction.reply({

                content:
                    `✅ ${
                        tipo === "entrada"
                            ? "Entrada"
                            : "Saída"
                    } registrada com sucesso!\n\n` +
                    `💰 Valor: **${valor.toLocaleString(
                        "pt-BR",
                        {
                            style:
                                "currency",

                            currency:
                                "BRL"
                        }
                    )}**\n` +
                    `📂 Categoria: **${categoria}**`,

                flags:
                    64

            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao registrar movimentação financeira:",
                error
            );

            await interaction.reply({

                content:
                    "❌ Ocorreu um erro ao registrar a movimentação financeira.",

                flags:
                    64

            });

            apagarResposta(interaction);

        }

        return;

    }

        // ==================================================
    // EDITOR DE EMBEDS — TÍTULO
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_titulo"
    ) {

        const titulo =
            interaction.fields.getTextInputValue(
                "titulo"
            );

        atualizarEditor(
            interaction.user.id,
            {
                titulo
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Título salvo com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — DESCRIÇÃO
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_descricao"
    ) {

        const descricao =
            interaction.fields.getTextInputValue(
                "descricao"
            );

        atualizarEditor(
            interaction.user.id,
            {
                descricao
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Descrição salva com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — COR
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_cor"
    ) {

        let cor =
            interaction.fields
                .getTextInputValue("cor")
                .trim();

        if (!cor.startsWith("#")) {

            cor = `#${cor}`;

        }

        const regex =
            /^#[0-9A-Fa-f]{6}$/;

        if (!regex.test(cor)) {

            await interaction.reply({

                content:
                    "❌ Informe uma cor HEX válida.\n\n" +
                    "Exemplo: **#57F287**",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        atualizarEditor(
            interaction.user.id,
            {
                cor
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Cor atualizada com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — FAIXA
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_faixa"
    ) {

        const url =
            interaction.fields
                .getTextInputValue("url")
                .trim();

        try {

            new URL(url);

        } catch {

            await interaction.reply({

                content:
                    "❌ Informe uma URL válida para a faixa.",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        atualizarEditor(
            interaction.user.id,
            {
                faixa: url
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Faixa atualizada com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — RODAPÉ
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_rodape"
    ) {

        const texto =
            interaction.fields
                .getTextInputValue("texto")
                .trim();

        atualizarEditor(
            interaction.user.id,
            {
                rodape: texto
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Rodapé atualizado com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — CAMPO
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_campo"
    ) {

        const nome =
            interaction.fields.getTextInputValue(
                "nome"
            );

        const valor =
            interaction.fields.getTextInputValue(
                "valor"
            );

        const inlineTexto =
            interaction.fields
                .getTextInputValue("inline")
                .trim()
                .toLowerCase();

        const inline = [
            "sim",
            "s",
            "yes",
            "true",
            "1"
        ].includes(inlineTexto);

        try {

            adicionarCampo(
                interaction.user.id,
                {
                    name: nome,
                    value: valor,
                    inline
                }
            );

            await atualizarPainelEditor(
                interaction,
                "✅ Campo adicionado com sucesso."
            );

        } catch (error) {

            await interaction.reply({

                content:
                    `❌ ${error.message}`,

                flags: 64

            });

            apagarResposta(interaction);

        }

        return;

    }

   // ==================================================
// REGISTRO DE INTEGRANTES
// ==================================================

if (
    interaction.customId ===
    "registroModal"
) {

    const nome =
        interaction.fields
            .getTextInputValue(
                "nome"
            )
            .trim();

    const idCidade =
        interaction.fields
            .getTextInputValue(
                "idCidade"
            )
            .trim();

    const recrutador =
        interaction.fields
            .getTextInputValue(
                "recrutador"
            )
            .trim();

    const areaDesejada =
        interaction.fields
            .getTextInputValue(
                "areaDesejada"
            )
            .trim();

    const live =
        interaction.fields
            .getTextInputValue(
                "live"
            )
            .trim();

    try {

        const resultado =
            await registrar(
                interaction,
                {
                    nome,
                    idCidade,
                    recrutador,
                    areaDesejada,
                    live
                }
            );

        await interaction.reply({

            content:
`✅ Sua ficha foi enviada para análise.

👤 **Nome:** ${resultado.nome}

🆔 **ID:** ${resultado.idCidade}

🎯 **Área desejada:** ${resultado.areaDesejada}

📌 **Status:** Aguardando aprovação

Você receberá uma mensagem privada quando seu registro for aprovado ou reprovado.`,

            flags:
                MessageFlags.Ephemeral

        });

    } catch (error) {

        console.error(
            "Erro ao enviar registro:",
            error
        );

        await interaction.reply({

            content:
                `❌ ${
                    error.message ||
                    "Não foi possível enviar seu registro."
                }`,

            flags:
                MessageFlags.Ephemeral

        });

    }

    apagarResposta(
        interaction,
        15000
    );

    return;

}
}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    handleModal
};