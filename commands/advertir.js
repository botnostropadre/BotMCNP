const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("advertir")

        .setDescription("Aplicar uma advertência.")

        .addUserOption(option =>

            option

                .setName("membro")

                .setDescription("Selecione o membro")

                .setRequired(true)

        )

        .setDefaultMemberPermissions(

            PermissionFlagsBits.ManageMessages

        ),

    async execute(interaction) {

        const membro = interaction.options.getUser("membro");

        const modal = new ModalBuilder()

            .setCustomId(`advertencia_${membro.id}`)

            .setTitle("Nova Advertência");

        const motivo = new TextInputBuilder()

            .setCustomId("motivo")

            .setLabel("Motivo")

            .setStyle(TextInputStyle.Paragraph)

            .setRequired(true);

        const gravidade = new TextInputBuilder()

            .setCustomId("gravidade")

            .setLabel("Gravidade (Leve, Média ou Grave)")

            .setStyle(TextInputStyle.Short)

            .setRequired(true);

        modal.addComponents(

            new ActionRowBuilder().addComponents(motivo),

            new ActionRowBuilder().addComponents(gravidade)

        );

        await interaction.showModal(modal);

    }

};