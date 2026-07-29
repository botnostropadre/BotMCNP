const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("painel")

        .setDescription("Painel administrativo do MC.")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        ),

    async execute(interaction) {

        const embed = new EmbedBuilder()

            .setColor("#2ECC71")

            .setTitle("🏍 Padre Nosso MC")

            .setDescription("### Sistema Administrativo\n\nEscolha uma opção abaixo.")

            .setFooter({
                text: "Padre Nosso MC"
            });

        const row1 = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("painel_ficha")

                    .setLabel("Ficha")

                    .setEmoji("👤")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("painel_promover")

                    .setLabel("Promover")

                    .setEmoji("⬆️")

                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()

                    .setCustomId("painel_rebaixar")

                    .setLabel("Rebaixar")

                    .setEmoji("⬇️")

                    .setStyle(ButtonStyle.Secondary)

            );

        const row2 = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("painel_advertir")

                    .setLabel("Advertir")

                    .setEmoji("⚠️")

                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()

                    .setCustomId("painel_expulsar")

                    .setLabel("Expulsar")

                    .setEmoji("💀")

                    .setStyle(ButtonStyle.Danger)

            );

        await interaction.reply({

            embeds: [embed],

            components: [row1, row2],

            ephemeral: true

        });

    }

};