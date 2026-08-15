const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

const {
    atualizarParceiros
} = require(
    "../services/atualizarParceiros"
);

// ======================================================
// COMANDO /ATUALIZARPARCEIROS
// ======================================================

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                "atualizarparceiros"
            )

            .setDescription(
                "Atualiza ou recria o painel de parceiros."
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

    async execute(
        interaction
    ) {

        await interaction.deferReply({

            flags:
                MessageFlags.Ephemeral

        });

        try {

            const resultado =
                await atualizarParceiros(
                    interaction.client
                );

            await interaction.editReply({

                content:
`✅ **Painel de parceiros atualizado com sucesso!**

📊 Parceiros exibidos: **${resultado.parceiros.length}**

📌 O painel foi atualizado ou recriado automaticamente no canal de parceiros.`

            });

        } catch (error) {

            console.error(
                "Erro ao atualizar painel de parceiros:",
                error
            );

            await interaction.editReply({

                content:
                    `❌ Não foi possível atualizar o painel de parceiros.\n\n` +
                    `Erro: ${error.message}`

            }).catch(
                () => {}
            );

        }

    }

};