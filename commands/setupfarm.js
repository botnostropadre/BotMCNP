const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const COLORS =
    require("../config/colors");

const settings =
    require("../config/settings.json");

const {
    criarFarmButton
} = require("../buttons/farmButton");

const CANAL_REGISTRAR_FARM =
    "1530466546072293416";

// ======================================================
// COMANDO /SETUPFARM
// ======================================================

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                "setupfarm"
            )

            .setDescription(
                "Cria o painel de registro de farm."
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

    async execute(
        interaction
    ) {

        try {

            // ==================================================
            // LOCALIZAR CANAL
            // ==================================================

            const canal =
                interaction.guild.channels.cache.get(
                    CANAL_REGISTRAR_FARM
                ) ||
                await interaction.guild.channels
                    .fetch(
                        CANAL_REGISTRAR_FARM
                    )
                    .catch(
                        () => null
                    );

            if (
                !canal ||
                !canal.isTextBased()
            ) {

                await interaction.reply({

                    content:
                        "❌ O canal de registro de farm não foi encontrado.",

                    flags:
                        MessageFlags.Ephemeral

                });

                return;

            }

            // ==================================================
            // PAINEL
            // ==================================================

            const embed =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERDE
                    )

                    .setTitle(
                        "📦 Registro de Produção"
                    )

                    .setDescription(
`Bem-vindo ao sistema de controle de produção da **${settings.mc.nome}**.

Utilize o botão abaixo para registrar sua produção.

━━━━━━━━━━━━━━━━━━━━

💳 **Dados**

Meta diária:
**500 unidades**

━━━━━━━━━━━━━━━━━━━━

💵 **Dinheiro Sujo**

Meta semanal:
**R$ 500.000**

━━━━━━━━━━━━━━━━━━━━

⚠️ Pelo menos um dos campos deve ser preenchido para concluir o registro.`
                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Controle de Produção`

                    })

                    .setTimestamp();

            // ==================================================
            // ENVIAR PAINEL
            // ==================================================

            await canal.send({

                embeds: [
                    embed
                ],

                components:
                    criarFarmButton()

            });

            // ==================================================
            // CONFIRMAÇÃO
            // ==================================================

            await interaction.reply({

                content:
                    `✅ Painel criado com sucesso em ${canal}.`,

                flags:
                    MessageFlags.Ephemeral

            });

            setTimeout(
                async () => {

                    try {

                        await interaction.deleteReply();

                    } catch {}

                },
                10000
            );

        } catch (error) {

            console.error(
                "Erro ao criar painel de farm:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({

                    content:
                        "❌ Não foi possível criar o painel de farm.",

                    flags:
                        MessageFlags.Ephemeral

                }).catch(
                    () => {}
                );

            }

        }

    }

};