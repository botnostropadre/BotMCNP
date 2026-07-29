const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { buscarMembro } = require("../database/membroRepository");
const { criarFicha } = require("../embeds/fichaEmbed");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("ficha")

        .setDescription("Exibe a ficha de um integrante.")

        .addUserOption(option =>

            option

                .setName("membro")

                .setDescription("Integrante que deseja consultar")

                .setRequired(false)

        )

        .setDefaultMemberPermissions(

            PermissionFlagsBits.ManageRoles

        ),

    async execute(interaction) {

        const usuario =
            interaction.options.getUser("membro") ||
            interaction.user;

        const membro = await buscarMembro(usuario.id);

        if (!membro) {

            await interaction.reply({

                content: "❌ Este usuário não possui registro.",

                flags: 64

            });

            setTimeout(async () => {

                try {

                    await interaction.deleteReply();

                } catch {}

            }, 10000);

            return;

        }

        const advertencias = 0;

        const embed = criarFicha(

            usuario,

            membro,

            advertencias

        );

        await interaction.reply({

            embeds: [embed],

            flags: 64

        });

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

    }

};