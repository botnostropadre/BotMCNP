const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

const {
    criarParceirosButton
} = require("../buttons/parceirosButton");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const CANAL_REGISTRAR_PARCEIROS =
    "1534993345519030412";

// ======================================================
// COMANDO /SETUPPARCEIROS
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setupparceiros")

        .setDescription(
            "Cria o painel de registro de parceiros."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            const canal =
                interaction.guild.channels.cache.get(
                    CANAL_REGISTRAR_PARCEIROS
                ) ||
                await interaction.guild.channels
                    .fetch(
                        CANAL_REGISTRAR_PARCEIROS
                    )
                    .catch(() => null);

            if (
                !canal ||
                !canal.isTextBased()
            ) {

                await interaction.reply({

                    content:
                        "❌ O canal de registro de parceiros não foi encontrado.",

                    flags:
                        MessageFlags.Ephemeral

                });

                return;

            }

            const embed =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERDE
                    )

                    .setTitle(
                        "🤝 Registro de Parceiros"
                    )

                    .setDescription(
`Utilize este painel para cadastrar os parceiros da organização.

Durante o registro, serão solicitadas as seguintes informações:

🏛️ **Nome da facção**

📦 **Produto ou serviço principal**

👤 **Responsáveis e telefones**

💰 **Produtos e valores**

As categorias disponíveis são:

1. Armas
2. Munições
3. Drogas
4. Contrabando
5. Desmanche
6. Hospital Ilegal
7. Restaurantes
8. Mecânicas

Após concluir o cadastro, o painel do canal de parceiros será atualizado automaticamente.`
                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Sistema de Parceiros`

                    })

                    .setTimestamp();

            await canal.send({

                embeds: [
                    embed
                ],

                components:
                    criarParceirosButton()

            });

            await interaction.reply({

                content:
                    `✅ Painel de parceiros criado com sucesso em ${canal}.`,

                flags:
                    MessageFlags.Ephemeral

            });

        } catch (error) {

            console.error(
                "Erro ao criar painel de parceiros:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({

                    content:
                        "❌ Não foi possível criar o painel de parceiros.",

                    flags:
                        MessageFlags.Ephemeral

                }).catch(() => {});

            }

        }

    }

};