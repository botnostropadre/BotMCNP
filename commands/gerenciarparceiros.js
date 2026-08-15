const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const COLORS =
    require("../config/colors");

const settings =
    require("../config/settings.json");

const {
    listarParceiros
} = require(
    "../services/parceiroService"
);

const {
    criarParceiroGerenciarMenu
} = require(
    "../selectMenus/parceiroGerenciarMenu"
);

// ======================================================
// COMANDO /GERENCIARPARCEIROS
// ======================================================

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                "gerenciarparceiros"
            )

            .setDescription(
                "Gerencia os parceiros cadastrados."
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

            const parceiros =
                await listarParceiros();

            if (
                !Array.isArray(
                    parceiros
                ) ||
                parceiros.length === 0
            ) {

                await interaction.editReply({

                    content:
                        "⚠️ Nenhum parceiro foi cadastrado ainda."

                });

                return;

            }

            const embed =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERDE
                    )

                    .setTitle(
                        "🤝 Gerenciamento de Parceiros"
                    )

                    .setDescription(
`Selecione abaixo a FAC que deseja gerenciar.

Após selecionar, você poderá:

✏️ **Editar**
Alterar as informações da parceria.

🗑️ **Excluir**
Remover a parceria do sistema.

━━━━━━━━━━━━━━━━━━━━

📊 Parceiros cadastrados: **${parceiros.length}**`
                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Gerenciamento de Parceiros`

                    })

                    .setTimestamp();

            await interaction.editReply({

                embeds: [
                    embed
                ],

                components:
                    criarParceiroGerenciarMenu(
                        parceiros
                    )

            });

        } catch (error) {

            console.error(
                "Erro ao abrir gerenciamento de parceiros:",
                error
            );

            await interaction.editReply({

                content:
                    `❌ Não foi possível abrir o gerenciamento de parceiros.\n\n` +
                    `Erro: ${error.message}`,

                embeds:
                    [],

                components:
                    []

            }).catch(
                () => {}
            );

        }

    }

};