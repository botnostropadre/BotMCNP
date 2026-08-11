const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");


const {
    criarModalCor
} = require("../modals/embedCorModal");


const {
    criarModalImagem
} = require("../modals/embedImagemModal");


const {
    criarModalRodape
} = require("../modals/embedRodapeModal");


const {
    atualizarEditor
} = require("../services/embedBuilderService");


const db = require("../database/database");


const settings = require("../config/settings.json");

const {
    ACOES
} = require("../config/acoes");

const {
    criarAcaoMarcadaEmbed
} = require("../embeds/acaoMarcadaEmbed");


const {
    criarAcaoParticipacaoButtons
} = require("../buttons/acaoParticipacaoButtons");


const {
    criarAcaoMarcada,
    listarParticipantes
} = require("../services/acaoService");


const {
    criarAcaoKillsModal
} = require("../modals/acaoKillsModal");


// ======================================================
// PERMISSÃO — ADMINISTRAÇÃO DE AÇÕES
// ======================================================

const CARGOS_ADMIN_ACOES = [

    "1530456364059721823", // Liderança

    "1535834868120948857", // Vice Liderança

    "1531838445045940296", // Resp ELITE

    "1535011230425681931"  // Elite

];

function podeAdministrarAcoes(
    interaction
) {

    return CARGOS_ADMIN_ACOES.some(
        cargoId =>
            interaction.member
                ?.roles
                ?.cache
                ?.has(
                    cargoId
                )
    );

}


// ======================================================
// APAGAR RESPOSTA TEMPORÁRIA
// ======================================================
function apagarResposta(interaction, tempo = 10000) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, tempo);

}

// ======================================================
// HANDLER DE MENUS DE SELEÇÃO
// ======================================================

async function handleSelectMenu(interaction) {

    if (
        !interaction.isStringSelectMenu() &&
        !interaction.isChannelSelectMenu()
    ) {

        return;

    }
// ==================================================
// REGISTRO — SELECIONAR CARGO
// ==================================================

if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith(
        "registro_cargo_"
    )
) {

    const registroId =
        interaction.customId.replace(
            "registro_cargo_",
            ""
        );

    const cargoId =
        interaction.values[0];

    const cargos = {

    [settings.cargos.eliteTeste]:
        "Elite Teste",

    [settings.cargos.treinamento]:
        "Treinamento",

    [settings.cargos.membro]:
        "Membro",

    [settings.cargos.recrutamento]:
        "Recrutamento",

    [settings.cargos.respEventos]:
        "Resp. Eventos",

    [settings.cargos.respElite]:
        "Resp. Elite",

    [settings.cargos.gerencia]:
        "Gerência",

    [settings.cargos.viceLideranca]:
        "Vice Liderança",

    [settings.cargos.lideranca]:
        "Liderança"

};

    const cargoNome =
        cargos[cargoId];

    if (!cargoNome) {

        await interaction.reply({

            content:
                "❌ O cargo selecionado não é válido.",

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    try {

        const registro =
            await new Promise(
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

        if (!registro) {

            await interaction.reply({

                content:
                    "❌ Esse registro não foi encontrado.",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        if (
            registro.status !==
            "Pendente"
        ) {

            await interaction.reply({

                content:
                    `⚠️ Esse registro já foi ${registro.status.toLowerCase()}.`,

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        await new Promise(
            (resolve, reject) => {

                db.run(
                    `
                        UPDATE registrosPendentes

                        SET
                            cargoSelecionadoId = ?,
                            cargoSelecionadoNome = ?

                        WHERE id = ?
                    `,
                    [
                        cargoId,
                        cargoNome,
                        registroId
                    ],
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

        await interaction.reply({

            content:
                `✅ Cargo selecionado para aprovação: **${cargoNome}**.`,

            flags: 64

        });

        apagarResposta(interaction);

    } catch (error) {

        console.error(
            "Erro ao selecionar cargo do registro:",
            error
        );

        await interaction.reply({

            content:
                "❌ Não foi possível salvar o cargo selecionado.",

            flags: 64

        }).catch(() => {});

        apagarResposta(interaction);

    }

    return;

}
// ======================================================
// AÇÕES — SELECIONAR PARTICIPANTE PARA KILLS
// ======================================================

if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith(
        "acao_kills_participante_"
    )
) {

    try {

        const acaoMarcadaId =
            Number(
                interaction.customId.replace(
                    "acao_kills_participante_",
                    ""
                )
            );

        const discordId =
            interaction.values[0];

        if (
            !Number.isInteger(
                acaoMarcadaId
            ) ||
            acaoMarcadaId <= 0 ||
            !discordId
        ) {

            await interaction.reply({

                content:
                    "❌ Participante ou ação inválida.",

                flags:
                    64

            });

            return;

        }

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

            await interaction.reply({

                content:
                    "❌ Esse participante não foi encontrado na ação.",

                flags:
                    64

            });

            return;

        }

        await interaction.showModal(

            criarAcaoKillsModal({

                acaoMarcadaId,

                discordId:
                    participante.discordId,

                nome:
                    participante.nome

            })

        );

    } catch (error) {

        console.error(
            "Erro ao selecionar participante para kills:",
            error
        );

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            await interaction.reply({

                content:
                    "❌ Não foi possível abrir o formulário de kills.",

                flags:
                    64

            }).catch(() => {});

        }

    }

    return;

}

// ======================================================
// AÇÕES — SELECIONAR PORTE
// ======================================================

if (
    interaction.isStringSelectMenu() &&
    interaction.customId ===
    "acao_selecionar_porte"
) {

    try {

        const porteSelecionado =
            interaction.values[0];

        const acoesDoPorte =
            ACOES.filter(
                acao =>
                    acao.ativo !== false &&
                    acao.porte === porteSelecionado
            );

        if (
            acoesDoPorte.length === 0
        ) {

            await interaction.reply({

                content:
                    `❌ Nenhuma ação de **${porteSelecionado} Porte** foi encontrada.`,

                flags:
                    64

            });

            return;

        }

        if (
            acoesDoPorte.length > 25
        ) {

            await interaction.reply({

                content:
                    "❌ Existem ações demais cadastradas nesse porte para exibir em um único menu.",

                flags:
                    64

            });

            return;

        }

        const menuAcoes =
            new StringSelectMenuBuilder()

                .setCustomId(
                    `acao_selecionar_${porteSelecionado
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()}`
                )

                .setPlaceholder(
                    `Escolha uma ação de ${porteSelecionado} Porte`
                );

        menuAcoes.addOptions(

            acoesDoPorte.map(
                acao => {

                    return {

                        label:
                            acao.nome.substring(
                                0,
                                100
                            ),

                        description:
                            `${acao.contingente} vagas + ${acao.reservas ?? 2} reservas`
                                .substring(
                                    0,
                                    100
                                ),

                        value:
                            acao.chave

                    };

                }
            )

        );

        const row =
            new ActionRowBuilder()

                .addComponents(
                    menuAcoes
                );

        await interaction.reply({

            content:
                `🎯 **${porteSelecionado} Porte**\nSelecione a ação que deseja marcar:`,

            components: [
                row
            ],

            flags:
                64

        });

    } catch (error) {

        console.error(
            "Erro ao selecionar porte da ação:",
            error
        );

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            await interaction.reply({

                content:
                    "❌ Não foi possível carregar as ações desse porte.",

                flags:
                    64

            }).catch(() => {});

        }

    }

    return;

}
// ======================================================
// AÇÕES — SELECIONAR AÇÃO
// ======================================================

if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith(
        "acao_selecionar_"
    ) &&
    interaction.customId !==
        "acao_selecionar_porte"
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
                "❌ Você não possui permissão para iniciar ações.",

            flags:
                64

        });

        return;

    }

    try {

        // ==============================================
        // LOCALIZAR AÇÃO NO CATÁLOGO
        // ==============================================

        const chaveAcao =
            interaction.values[0];

        const acao =
            ACOES.find(
                item =>
                    item.chave === chaveAcao &&
                    item.ativo !== false
            );

        if (!acao) {

            await interaction.reply({

                content:
                    "❌ A ação selecionada não foi encontrada.",

                flags:
                    64

            });

            return;

        }

        // ==============================================
        // LOCALIZAR AÇÃO NO BANCO
        // ==============================================

        const acaoBanco =
            await new Promise(
                (resolve, reject) => {

                    db.get(
                        `
                            SELECT *
                            FROM acoes
                            WHERE chave = ?
                        `,
                        [
                            chaveAcao
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

        if (!acaoBanco) {

            await interaction.reply({

                content:
                    "❌ Essa ação ainda não foi sincronizada com o banco de dados.",

                flags:
                    64

            });

            return;

        }

        

        // ==============================================
        // CRIAR AÇÃO MARCADA NO BANCO
        // ==============================================

        const acaoMarcada =
            await criarAcaoMarcada({

                acaoId:
                    acaoBanco.id,

                criadoPorId:
                    interaction.user.id,

                criadoPorNome:
                    interaction.user.username

            });

        // ==============================================
        // LOCALIZAR CANAL AÇÕES MARCADAS
        // ==============================================

        const CANAL_ACOES_MARCADAS =
            "1536490600986058803";

        const canal =
            interaction.guild.channels.cache.get(
                CANAL_ACOES_MARCADAS
            ) ||
            await interaction.guild.channels
                .fetch(
                    CANAL_ACOES_MARCADAS
                )
                .catch(() => null);

        if (
            !canal ||
            !canal.isTextBased()
        ) {

            throw new Error(
                "Canal de ações marcadas não encontrado."
            );

        }

        // ==============================================
        // MONTAR DADOS DO EMBED
        // ==============================================

        const dadosEmbed = {

            ...acao,

            nomeAcao:
                acao.nome

        };

        const embed =
            criarAcaoMarcadaEmbed(
                dadosEmbed,
                []
            );

        const componentes =
            criarAcaoParticipacaoButtons(
                acaoMarcada.id
            );

        // ==============================================
        // PUBLICAR AÇÃO
        // ==============================================

        const mensagem =
            await canal.send({

                embeds: [
                    embed
                ],

                components:
                    componentes

            });

        // ==============================================
        // SALVAR ID DA MENSAGEM
        // ==============================================

        await new Promise(
            (resolve, reject) => {

                db.run(
                    `
                        UPDATE acoesMarcadas

                        SET
                            mensagemId = ?,
                            canalId = ?

                        WHERE id = ?
                    `,
                    [
                        mensagem.id,
                        canal.id,
                        acaoMarcada.id
                    ],
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

        // ==============================================
        // CONFIRMAR PARA QUEM MARCOU
        // ==============================================

        await interaction.update({

            content:
                `✅ Ação **${acao.nome}** marcada com sucesso.\nA ficha foi criada em ${canal}.`,

            components: []

        });

    } catch (error) {

        console.error(
            "Erro ao marcar ação:",
            error
        );

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            await interaction.reply({

                content:
                    "❌ Não foi possível marcar essa ação.",

                flags:
                    64

            }).catch(() => {});

        }

    }

    return;

}
    // ==================================================
    // MENU VISUAL DO EMBED
    // ==================================================

    if (
        interaction.isStringSelectMenu() &&
        interaction.customId ===
        "embed_visual_menu"
    ) {

        const opcao = interaction.values[0];

        if (opcao === "cor") {

            return interaction.showModal(
                criarModalCor()
            );

        }

        if (opcao === "rodape") {

            return interaction.showModal(
                criarModalRodape()
            );

        }

        return;

    }

    // ==================================================
    // MENU DE IMAGEM DO EMBED
    // ==================================================

    if (
        interaction.isStringSelectMenu() &&
        interaction.customId ===
        "embed_imagem_menu"
    ) {

        const opcao = interaction.values[0];

        if (opcao === "faixa") {

            return interaction.showModal(
                criarModalImagem()
            );

        }

        return;

    }

    // ==================================================
    // SELEÇÃO DO CANAL DE PUBLICAÇÃO
    // ==================================================

    if (
        interaction.isChannelSelectMenu() &&
        interaction.customId ===
        "embed_canal_menu"
    ) {

        atualizarEditor(
            interaction.user.id,
            {
                canal: interaction.values[0]
            }
        );

        await interaction.reply({

            content:
                "✅ Canal salvo com sucesso.",

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

}

module.exports = {

    handleSelectMenu

};