const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const CANAL_CRIAR_EVENTOS =
    "1534992950503931924";

// ======================================================
// COMANDO
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setupeventos")

        .setDescription(
            "Cria o painel de criação de eventos."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const canal =
            interaction.guild.channels.cache.get(
                CANAL_CRIAR_EVENTOS
            );

        if (
            !canal ||
            !canal.isTextBased()
        ) {

            return interaction.reply({

                content:
                    "❌ O canal de criação de eventos não foi encontrado.",

                flags:
                    MessageFlags.Ephemeral

            });

        }

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("📅 Criador de Eventos")

            .setDescription(
`Utilize este painel para criar novos eventos da organização.

Ao clicar no botão abaixo será solicitado:

• Nome do evento

• Descrição

• Data e hora

• Traje

• Responsável

• Quantidade de auxiliares

• Flyer

Após concluir o formulário, o evento será publicado automaticamente no canal de eventos.`
            )

            .setFooter({

                text:
                    `${settings.mc.nome} • Sistema de Eventos`

            })

            .setTimestamp();

        const row =
            new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId(
                            "evento_criar"
                        )

                        .setLabel(
                            "Criar Evento"
                        )

                        .setEmoji("📅")

                        .setStyle(
                            ButtonStyle.Success
                        )

                );

        await canal.send({

            embeds: [embed],

            components: [row]

        });

        await interaction.reply({

            content:
                "✅ Painel de eventos criado com sucesso.",

            flags:
                MessageFlags.Ephemeral

        });

    }

};