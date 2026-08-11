const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require("discord.js");

const COLORS =
    require("../config/colors");

const settings =
    require("../config/settings.json");

// ======================================================
// CARGO AUTORIZADO
// ======================================================

const CARGO_LIDERANCA =
    "1530456364059721823";

// ======================================================
// COMANDO
// ======================================================

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                "resetacoes"
            )

            .setDescription(
                "Reseta a temporada de ações, ranking PVP e estatísticas."
            ),

    async execute(
        interaction
    ) {

        // ==========================================
        // PERMISSÃO
        // ==========================================

        if (
            !interaction.member.roles.cache.has(
                CARGO_LIDERANCA
            )
        ) {

            await interaction.reply({

                content:
                    "❌ Apenas a **Liderança** pode utilizar este comando.",

                flags:
                    MessageFlags.Ephemeral

            });

            return;

        }

        // ==========================================
        // AVISO
        // ==========================================

        const embed =
            new EmbedBuilder()

                .setColor(
                    COLORS.VERMELHO
                )

                .setTitle(
                    "⚠️ RESETAR TEMPORADA DE AÇÕES"
                )

                .setDescription(
`Você está prestes a **zerar completamente o histórico da temporada**.

Serão apagados:

💀 **Kills registradas**
🏆 **Vitórias e derrotas**
💰 **Valores arrecadados**
🎯 **Histórico das ações finalizadas**
📊 **Estatísticas Gerais**
🥇 **Ranking PVP**

### O que NÃO será apagado

✅ Catálogo das ações
✅ Regras das ações
✅ Perímetros
✅ Ações atualmente abertas
✅ Integrantes
✅ Configurações do bot

⚠️ **Essa operação não poderá ser desfeita.**`
                )

                .setFooter({

                    text:
                        `${settings.mc.nome} • Administração`

                })

                .setTimestamp();

        // ==========================================
        // BOTÕES
        // ==========================================

        const botoes =
            new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId(
                            "resetacoes_confirmar"
                        )

                        .setLabel(
                            "Confirmar Reset"
                        )

                        .setEmoji(
                            "🗑️"
                        )

                        .setStyle(
                            ButtonStyle.Danger
                        ),

                    new ButtonBuilder()

                        .setCustomId(
                            "resetacoes_cancelar"
                        )

                        .setLabel(
                            "Cancelar"
                        )

                        .setEmoji(
                            "❌"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        )

                );

        await interaction.reply({

            embeds: [
                embed
            ],

            components: [
                botoes
            ],

            flags:
                MessageFlags.Ephemeral

        });

    }

};