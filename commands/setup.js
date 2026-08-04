const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const settings = require("../config/settings.json");

const {
    criarBotaoRegistro
} = require("../buttons/registroButton");

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

        const embed = new EmbedBuilder()

            .setColor("#2B2D31")

            .setTitle(
                `💵 ${settings.mc.nome}`
            )

            .setDescription(
`Bem-vindo ao sistema de registro da ${settings.mc.nome}.

Clique no botão abaixo para iniciar seu cadastro.

Após preencher o formulário, você receberá automaticamente o cargo **Treinamento**.`
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

        await interaction.reply({

            content:
                "✅ Painel de registro criado com sucesso.",

            flags:
                MessageFlags.Ephemeral

        });

        await interaction.channel.send({

            embeds: [embed],

            components: [row]

        });

    }

};