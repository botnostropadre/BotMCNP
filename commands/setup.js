const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

const { criarBotaoRegistro } = require("../buttons/registroButton");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setup")

        .setDescription("Cria o painel de registro.")

        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()

            .setColor("#2B2D31")

            .setTitle("🏍 Padre Nosso MC")

            .setDescription(
`Bem-vindo ao sistema de registro.

Clique no botão abaixo para iniciar seu cadastro.

Após preencher o formulário você receberá o cargo **Prospect** automaticamente.`
            )

            .setFooter({
                text: "Padre Nosso MC"
            });

        const row = new ActionRowBuilder()
            .addComponents(criarBotaoRegistro());

        await interaction.reply({
            content: "✅ Painel criado.",
            ephemeral: true
        });

        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });

    }

};