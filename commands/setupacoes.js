const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    MessageFlags
} = require("discord.js");

const settings =
    require("../config/settings.json");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const CANAL_MARCAR_ACAO =
    "1534993179919777792";

// ======================================================
// CRIAR MENU DE PORTES
// ======================================================

function criarMenuPortes() {

    const menu =
        new StringSelectMenuBuilder()

            .setCustomId(
                "acao_selecionar_porte"
            )

            .setPlaceholder(
                "Selecione o porte da ação"
            )

            .addOptions(

                {
                    label:
                        "Pequeno Porte",

                    description:
                        "Visualizar ações de pequeno porte.",

                    value:
                        "Pequeno",

                    emoji:
                        "🟢"
                },

                {
                    label:
                        "Médio Porte",

                    description:
                        "Visualizar ações de médio porte.",

                    value:
                        "Médio",

                    emoji:
                        "🟡"
                },

                {
                    label:
                        "Grande Porte",

                    description:
                        "Visualizar ações de grande porte.",

                    value:
                        "Grande",

                    emoji:
                        "🔴"
                }

            );

    return new ActionRowBuilder()
        .addComponents(
            menu
        );

}

// ======================================================
// COMANDO
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName(
            "setupacoes"
        )

        .setDescription(
            "Cria o painel para marcação de ações."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            const canal =
                interaction.guild.channels.cache.get(
                    CANAL_MARCAR_ACAO
                ) ||
                await interaction.guild.channels
                    .fetch(
                        CANAL_MARCAR_ACAO
                    )
                    .catch(() => null);

            if (
                !canal ||
                !canal.isTextBased()
            ) {

                await interaction.reply({

                    content:
                        "❌ O canal de marcação de ações não foi encontrado.",

                    flags:
                        MessageFlags.Ephemeral

                });

                return;

            }

            const embed =
                new EmbedBuilder()

                    .setColor(
                        "#2B2D31"
                    )

                    .setTitle(
                        "🎯 Marcar Ação"
                    )

                    .setDescription(
`Selecione abaixo o **porte da ação** que deseja organizar.

🟢 **Pequeno Porte**
Ações com menor contingente.

🟡 **Médio Porte**
Ações intermediárias.

🔴 **Grande Porte**
Ações com maior contingente.

━━━━━━━━━━━━━━━━━━━━━━

Após selecionar o porte, você poderá escolher a ação específica.

A ficha será criada automaticamente no canal de **Ações Marcadas**, com:

👥 Contingente necessário  
🪑 Reservas  
🔫 Armamento  
📋 Regras principais  
✅ Confirmação de presença`
                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Sistema de Ações`

                    })

                    .setTimestamp();

            await canal.send({

                embeds: [
                    embed
                ],

                components: [
                    criarMenuPortes()
                ]

            });

            await interaction.reply({

                content:
                    `✅ Painel de ações criado em ${canal}.`,

                flags:
                    MessageFlags.Ephemeral

            });

        } catch (error) {

            console.error(
                "Erro ao criar painel de ações:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({

                    content:
                        "❌ Não foi possível criar o painel de ações.",

                    flags:
                        MessageFlags.Ephemeral

                }).catch(() => {});

            }

        }

    }

};