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

        .setDescription("Abre o editor de embeds")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("📝 Editor de Embeds")

            .setDescription(`Clique no botão abaixo para iniciar o editor.`);

        const row = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("embed_novo")

                    .setLabel("➕ Novo Embed")

                    .setStyle(ButtonStyle.Success)

            );

        await interaction.reply({

            embeds: [embed],

            components: [row],

            flags: 64

        });

    }

};