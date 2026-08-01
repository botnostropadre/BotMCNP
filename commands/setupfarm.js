const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");

const {
    criarFarmButton
} = require("../buttons/farmButton");

const CANAL_REGISTRAR_FARM =
    "1530466546072293416";

// ======================================================
// COMANDO /SETUPFARM
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setupfarm")

        .setDescription(
            "Cria o painel fixo de registro de farm."
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const canal =
            interaction.guild.channels.cache.get(
                CANAL_REGISTRAR_FARM
            );

        if (
            !canal ||
            !canal.isTextBased()
        ) {

            await interaction.reply({

                content:
                    "❌ O canal de registro de farm não foi encontrado.",

                flags: 64

            });

            setTimeout(async () => {

                try {

                    await interaction.deleteReply();

                } catch {}

            }, 10000);

            return;

        }

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("📦 Registro de Farm")

            .setDescription(
`Utilize o botão abaixo para registrar seu farm.

Você poderá informar:

🧱 **Tijolos**
Meta semanal: **100 unidades**

🔩 **Materiais**
Meta diária: **200 unidades**

Os dois campos são opcionais, mas pelo menos um deles deve ser preenchido.`
            )

            .setFooter({
                text: "Padre Nosso MC"
            })

            .setTimestamp();

        await canal.send({

            embeds: [embed],

            components: criarFarmButton()

        });

        await interaction.reply({

            content:
                `✅ Painel de farm criado em ${canal}.`,

            flags: 64

        });

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

    }

};