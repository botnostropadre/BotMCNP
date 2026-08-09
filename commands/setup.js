const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const {
    criarBotaoRegistro
} = require("../buttons/registroButton");

const settings =
    require("../config/settings.json");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const CANAL_REGISTRO =
    "1530460702861430914";

// ======================================================
// COMANDO /SETUP
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setup")

        .setDescription(
            "Cria o painel de registro."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            const canal =
                interaction.guild.channels.cache.get(
                    CANAL_REGISTRO
                ) ||
                await interaction.guild.channels
                    .fetch(
                        CANAL_REGISTRO
                    )
                    .catch(() => null);

            if (
                !canal ||
                !canal.isTextBased()
            ) {

                await interaction.reply({

                    content:
                        "❌ O canal de registro não foi encontrado.",

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
                        `📋 Registro • ${settings.mc.nome}`
                    )

                    .setDescription(
`Utilize o botão abaixo para enviar sua ficha de entrada na organização.

Durante o registro serão solicitadas as seguintes informações:

👤 **Nome**

🆔 **ID**

🤝 **Quem te recrutou?**

🎯 **Área desejada**
Elite, Eventos ou Farm

📺 **Faz live?**
Caso faça, informe o link do seu canal.

---

Após enviar sua ficha, ela será encaminhada para análise da liderança.

Você **não receberá cargo automaticamente**.

Assim que o registro for analisado, você receberá o resultado por mensagem privada.`
                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Sistema de Registro`

                    })

                    .setTimestamp();

            const row =
                new ActionRowBuilder()

                    .addComponents(
                        criarBotaoRegistro()
                    );

            await canal.send({

                embeds: [
                    embed
                ],

                components: [
                    row
                ]

            });

            await interaction.reply({

                content:
                    `✅ Painel de registro criado em ${canal}.`,

                flags:
                    MessageFlags.Ephemeral

            });

        } catch (error) {

            console.error(
                "Erro ao criar painel de registro:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({

                    content:
                        "❌ Não foi possível criar o painel de registro.",

                    flags:
                        MessageFlags.Ephemeral

                }).catch(() => {});

            }

        }

    }

};