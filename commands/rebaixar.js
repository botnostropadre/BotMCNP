const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const hierarquia = require("../config/hierarquia");
const settings = require("../config/settings.json");
const COLORS = require("../config/colors");

const {
    buscarMembro,
    atualizarCargo,
    adicionarRebaixamento
} = require("../database/membroRepository");

// ======================================================
// APAGAR RESPOSTA APÓS 10 SEGUNDOS
// ======================================================

function apagarResposta(interaction) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {

            // A resposta pode já ter sido apagada.

        }

    }, 10000);

}

// ======================================================
// ENVIAR LOG DE REBAIXAMENTO
// ======================================================

async function enviarLogRebaixamento({
    interaction,
    membro,
    cargoAnterior,
    novoCargo,
    motivo
}) {

    const canalId =
        settings.canais?.rebaixamentos ||
        "1532120142857769142";

    if (!canalId) {

        console.error(
            "❌ O canal de rebaixamentos não está configurado."
        );

        return;

    }

    try {

        const canal =
            await interaction.guild.channels
                .fetch(canalId)
                .catch(() => null);

        if (!canal) {

            console.error(
                "❌ O canal de rebaixamentos não foi encontrado."
            );

            return;

        }

        if (!canal.isTextBased()) {

            console.error(
                "❌ O canal de rebaixamentos não aceita mensagens."
            );

            return;

        }

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERMELHO)

            .setTitle(
                "📉 Rebaixamento realizado"
            )

            .setDescription(
                `${membro} foi rebaixado dentro da hierarquia da ${settings.mc.nome}.`
            )

            .addFields(

                {
                    name: "👤 Integrante",
                    value: `${membro}`,
                    inline: false
                },

                {
                    name: "🎖 Cargo anterior",
                    value:
                        `${cargoAnterior.emoji} ${cargoAnterior.nome}`,
                    inline: true
                },

                {
                    name: "📉 Novo cargo",
                    value:
                        `${novoCargo.emoji} ${novoCargo.nome}`,
                    inline: true
                },

                {
                    name: "📝 Motivo",
                    value: motivo,
                    inline: false
                },

                {
                    name: "🛡 Responsável",
                    value: `${interaction.user}`,
                    inline: false
                }

            )

            .setThumbnail(
                membro.user.displayAvatarURL({
                    size: 256
                })
            )

            .setFooter({
                text:
                    `${settings.mc.nome} • Sistema de Rebaixamentos`
            })

            .setTimestamp();

        await canal.send({
            embeds: [embed]
        });

    } catch (error) {

        console.error(
            "Erro ao enviar log de rebaixamento:",
            error
        );

    }

}

// ======================================================
// COMANDO
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("rebaixar")

        .setDescription(
            "Rebaixa um integrante para o cargo anterior."
        )

        .addUserOption(option =>

            option

                .setName("membro")

                .setDescription(
                    "Selecione o integrante que será rebaixado."
                )

                .setRequired(true)

        )

        .addStringOption(option =>

            option

                .setName("motivo")

                .setDescription(
                    "Informe o motivo do rebaixamento."
                )

                .setMinLength(3)

                .setMaxLength(500)

                .setRequired(true)

        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageRoles
        ),

    async execute(interaction) {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {

            const membro =
                interaction.options.getMember(
                    "membro"
                );

            const motivo =
                interaction.options.getString(
                    "motivo",
                    true
                );

            // ==================================================
            // VALIDAR INTEGRANTE
            // ==================================================

            if (!membro) {

                await interaction.editReply({
                    content:
                        "❌ Não foi possível encontrar esse integrante no servidor."
                });

                apagarResposta(interaction);

                return;

            }

            if (membro.user.bot) {

                await interaction.editReply({
                    content:
                        "❌ Bots não podem ser rebaixados."
                });

                apagarResposta(interaction);

                return;

            }

            if (
                membro.id ===
                interaction.user.id
            ) {

                await interaction.editReply({
                    content:
                        "❌ Você não pode rebaixar a si mesmo."
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // BUSCAR CADASTRO
            // ==================================================

            const cadastro =
                await buscarMembro(
                    membro.id
                );

            if (!cadastro) {

                await interaction.editReply({
                    content:
                        `❌ Esse integrante não está cadastrado no sistema da ${settings.mc.nome}.`
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // IDENTIFICAR CARGO ATUAL
            // ==================================================

            const indiceAtual =
                hierarquia.findIndex(
                    cargo =>
                        cargo.id &&
                        membro.roles.cache.has(
                            cargo.id
                        )
                );

            if (indiceAtual === -1) {

                await interaction.editReply({
                    content:
                        "❌ Não foi possível identificar o cargo atual desse integrante."
                });

                apagarResposta(interaction);

                return;

            }

            const cargoAnterior =
                hierarquia[indiceAtual];
                        // ==================================================
            // VALIDAR MENOR CARGO
            // ==================================================

            if (indiceAtual === 0) {

                await interaction.editReply({
                    content:
                        `⚠️ ${membro} já ocupa o primeiro cargo da hierarquia: ` +
                        `**${cargoAnterior.nome}**.`
                });

                apagarResposta(interaction);

                return;

            }

            const novoCargo =
                hierarquia[indiceAtual - 1];

            // ==================================================
            // VALIDAR CONFIGURAÇÃO
            // ==================================================

            if (!novoCargo.id) {

                await interaction.editReply({
                    content:
                        `❌ O ID do cargo **${novoCargo.nome}** não está configurado corretamente.`
                });

                apagarResposta(interaction);

                return;

            }

            const cargoDiscordNovo =
                interaction.guild.roles.cache.get(
                    novoCargo.id
                );

            if (!cargoDiscordNovo) {

                await interaction.editReply({
                    content:
                        `❌ O cargo **${novoCargo.nome}** não foi encontrado no servidor.`
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // VALIDAR HIERARQUIA DO BOT
            // ==================================================

            const botMembro =
                interaction.guild.members.me;

            if (
                !botMembro ||
                botMembro.roles.highest.position <=
                cargoDiscordNovo.position
            ) {

                await interaction.editReply({
                    content:
                        `❌ O cargo do bot precisa estar acima de **${novoCargo.nome}** ` +
                        "na lista de cargos do servidor."
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // TROCAR CARGOS NO DISCORD
            // ==================================================

            const cargosAtuaisDaHierarquia =
                hierarquia
                    .map(cargo => cargo.id)
                    .filter(id =>
                        id &&
                        membro.roles.cache.has(id) &&
                        id !== novoCargo.id
                    );

            if (
                cargosAtuaisDaHierarquia.length > 0
            ) {

                await membro.roles.remove(
                    cargosAtuaisDaHierarquia,
                    `Rebaixamento realizado por ${interaction.user.tag}`
                );

            }

            await membro.roles.add(
                novoCargo.id,
                `Rebaixamento realizado por ${interaction.user.tag}`
            );

            // ==================================================
            // ATUALIZAR BANCO
            // ==================================================

            try {

                await atualizarCargo(
                    membro.id,
                    novoCargo.nome
                );

                await adicionarRebaixamento(
                    membro.id
                );

            } catch (databaseError) {

                try {

                    await membro.roles.remove(
                        novoCargo.id,
                        "Restauração após falha no banco de dados"
                    );

                    await membro.roles.add(
                        cargoAnterior.id,
                        "Restauração após falha no banco de dados"
                    );

                } catch (rollbackError) {

                    console.error(
                        "Erro ao restaurar cargo após falha no banco:",
                        rollbackError
                    );

                }

                throw databaseError;

            }

            // ==================================================
            // LOG
            // ==================================================

            await enviarLogRebaixamento({
                interaction,
                membro,
                cargoAnterior,
                novoCargo,
                motivo
            });

            // ==================================================
            // RESPOSTA
            // ==================================================

            const embedSucesso =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERMELHO
                    )

                    .setTitle(
                        "📉 Rebaixamento concluído"
                    )

                    .setDescription(
                        `${membro} foi rebaixado com sucesso dentro da ${settings.mc.nome}.`
                    )

                    .addFields(

                        {
                            name:
                                "🎖 Cargo anterior",

                            value:
                                `${cargoAnterior.emoji} ${cargoAnterior.nome}`,

                            inline:
                                true
                        },

                        {
                            name:
                                "📉 Novo cargo",

                            value:
                                `${novoCargo.emoji} ${novoCargo.nome}`,

                            inline:
                                true
                        },

                        {
                            name:
                                "📝 Motivo",

                            value:
                                motivo,

                            inline:
                                false
                        }

                    )

                    .setFooter({
                        text:
                            `${settings.mc.nome} • Sistema de Rebaixamentos`
                    })

                    .setTimestamp();

            await interaction.editReply({
                embeds: [embedSucesso]
            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro no comando /rebaixar:",
                error
            );

            try {

                await interaction.editReply({
                    content:
                        "❌ Ocorreu um erro ao realizar o rebaixamento. Verifique o console do bot."
                });

                apagarResposta(interaction);

            } catch (replyError) {

                console.error(
                    "Erro ao responder interação:",
                    replyError
                );

            }

        }

    }

};