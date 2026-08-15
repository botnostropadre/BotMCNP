const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

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
            "Cria o painel de registro de farm."
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

                flags:
                    MessageFlags.Ephemeral

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

            .setTitle("📦 Registro de Produção")

            .setDescription(
`Bem-vindo ao sistema de controle de produção da **${settings.mc.nome}**.

Utilize o botão abaixo para registrar sua produção.

━━━━━━━━━━━━━━━━━━━━

💳 **Dados**

Meta diária:
**350 unidades**

Meta semanal:
**1.750 unidades**

━━━━━━━━━━━━━━━━━━━━

💵 **Dinheiro Sujo**

Meta semanal:
**R$ 500.000**

━━━━━━━━━━━━━━━━━━━━

⚠️ Pelo menos um dos campos deve ser preenchido para concluir o registro.`
)

            .setFooter({

                text:
                    `${settings.mc.nome} • Controle de Produção`

            })

            .setTimestamp();

        await canal.send({

            embeds: [embed],

            components:
                criarFarmButton()

        });

        await interaction.reply({

            content:
                `✅ Painel criado com sucesso em ${canal}.`,

            flags:
                MessageFlags.Ephemeral

        });

        setTimeout(async () => {

            try {

                await interaction.deleteReply();

            } catch {}

        }, 10000);

    }

};