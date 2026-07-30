const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const COLORS = require("../config/colors");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setupembed")

        .setDescription("Cria o painel fixo do editor de embeds.")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            const embed = new EmbedBuilder()

                .setColor(COLORS.VERDE)

                .setTitle("📝 Editor de Embeds")

                .setDescription(
`Utilize este painel para criar e publicar embeds personalizados.

Você poderá configurar:

**Título**
**Descrição**
**Rodapé**
**Faixa inferior**
**Canal de publicação**

As formatações do Discord podem ser utilizadas normalmente nos textos.`
                )

                .setFooter({
                    text: "Padre Nosso MC"
                });

            const row = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId("embed_novo")

                        .setLabel("Novo Embed")

                        .setEmoji("➕")

                        .setStyle(ButtonStyle.Success)

                );

            await interaction.channel.send({

                embeds: [embed],

                components: [row]

            });

            await interaction.reply({

                content: "✅ Painel do editor de embeds criado.",

                flags: 64

            });

            setTimeout(async () => {

                try {

                    await interaction.deleteReply();

                } catch (error) {

                    console.error(
                        "Erro ao apagar confirmação do painel de embeds:",
                        error.message
                    );

                }

            }, 5000);

        } catch (error) {

            console.error(
                "Erro ao criar painel de embeds:",
                error
            );

            if (!interaction.replied) {

                await interaction.reply({

                    content: "❌ Não foi possível criar o painel de embeds.",

                    flags: 64

                });

            }

        }

    }

};