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
    criarParceirosButton
} = require("../buttons/parceirosButton");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const CANAL_REGISTRAR_PARCEIROS =
    "1534993345519030412";

// ======================================================
// COMANDO /SETUPPARCEIROS
// ======================================================

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                "setupparceiros"
            )

            .setDescription(
                "Cria o painel de registro de parceiros."
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

  async execute(
    interaction
) {

    console.log(
        "[SETUPPARCEIROS] execute iniciado"
    );

    try {

        // ==================================================
        // RESPONDER À INTERAÇÃO
        // ==================================================

        await interaction.deferReply({

            flags:
                MessageFlags.Ephemeral

        });

        console.log(
            "[SETUPPARCEIROS] deferReply OK"
        );

        // ==================================================
        // LOCALIZAR CANAL
        // ==================================================

        const canal =
            interaction.guild.channels.cache.get(
                CANAL_REGISTRAR_PARCEIROS
            ) ||
            await interaction.guild.channels
                .fetch(
                    CANAL_REGISTRAR_PARCEIROS
                )
                .catch(
                    () => null
                );

        console.log(
            "[SETUPPARCEIROS] canal:",
            canal?.id,
            canal?.name
        );

        if (
            !canal ||
            !canal.isTextBased()
        ) {

            await interaction.editReply({

                content:
                    "❌ O canal de registro de parceiros não foi encontrado."

            });

            return;

        }
            // ==================================================
            // CRIAR EMBED
            // ==================================================

            const embed =
                new EmbedBuilder()

                    .setColor(
                        COLORS.VERDE
                    )

                    .setTitle(
                        "🤝 Registro de Parceiros"
                    )

                    .setDescription(
`Utilize este painel para cadastrar os parceiros da **${settings.mc.nome}**.

O cadastro solicitará somente as seguintes informações:

🏛️ **Nome da FAC**

📦 **Produto que trabalha**

📝 **Descrição**
Até **4.000 caracteres**.

💬 **Sala do Dark Chat**

🔐 **Senha da sala**

━━━━━━━━━━━━━━━━━━━━

Após concluir o cadastro, o painel de parceiros será atualizado automaticamente.`
                    )

                    .setFooter({

                        text:
                            `${settings.mc.nome} • Sistema de Parceiros`

                    })

                    .setTimestamp();

            // ==================================================
            // ENVIAR PAINEL
            // ==================================================

            console.log(
    "[SETUPPARCEIROS] enviando painel"
);

await canal.send({

    embeds: [
        embed
    ],

    components:
        criarParceirosButton()

});

console.log(
    "[SETUPPARCEIROS] painel enviado"
);

            // ==================================================
            // CONFIRMAÇÃO
            // ==================================================

            await interaction.editReply({

                content:
                    `✅ Painel de parceiros criado com sucesso em ${canal}.`

            });

        } catch (error) {

            console.error(
                "Erro ao criar painel de parceiros:",
                error
            );

            const mensagem =
                `❌ Não foi possível criar o painel de parceiros.\n\n` +
                `Erro: ${error.message}`;

            if (
                interaction.deferred ||
                interaction.replied
            ) {

                await interaction.editReply({

                    content:
                        mensagem,

                    embeds:
                        [],

                    components:
                        []

                }).catch(
                    () => {}
                );

            } else {

                await interaction.reply({

                    content:
                        mensagem,

                    flags:
                        MessageFlags.Ephemeral

                }).catch(
                    () => {}
                );

            }

        }

    }

};