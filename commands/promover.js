const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const hierarquia = require("../config/hierarquia");
const settings = require("../config/settings.json");
const COLORS = require("../config/colors");

const {
    buscarMembro,
    atualizarCargo,
    adicionarPromocao
} = require("../database/membroRepository");

// ======================================================
// APAGAR RESPOSTA APÓS 10 SEGUNDOS
// ======================================================

function apagarResposta(interaction) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch (error) {

            // A resposta pode já ter sido apagada.
        }

    }, 10000);

}

// ======================================================
// ENVIAR LOG DE PROMOÇÃO
// ======================================================

async function enviarLogPromocao({
    interaction,
    membro,
    cargoAnterior,
    novoCargo
}) {

    /*
     * O código procura o canal de log usando alguns nomes possíveis.
     * Será utilizado o primeiro ID válido encontrado.
     */

    const canalId = "1532120021168291850";
    console.log("Canal configurado:", canalId);

console.log("📈 ID do canal de promoções:", canalId);

if (!canalId) {

    console.error(
        "❌ O canal de promoções não está configurado no settings.json."
    );

    return;

}

try {

    const canal = await interaction.guild.channels.fetch(canalId);
console.log("Canal encontrado:", canal?.name);
    console.log(
        "📈 Canal de promoções encontrado:",
        canal?.name,
        canal?.id
    );

    if (!canal) {

        console.error(
            "❌ O canal de promoções não foi encontrado no servidor."
        );

        return;

    }

    if (!canal.isTextBased()) {

        console.error(
            "❌ O canal configurado em promoções não aceita mensagens."
        );

        return;

    }

        const embed = new EmbedBuilder()

            .setColor(COLORS.VERDE)

            .setTitle("📈 Promoção realizada")

            .setDescription(
                `${membro} recebeu uma nova promoção dentro do motoclube.`
            )

            .addFields(

                {
                    name: "👤 Integrante",
                    value: `${membro}`,
                    inline: false
                },

                {
                    name: "🎖 Cargo anterior",
                    value: `${cargoAnterior.emoji} ${cargoAnterior.nome}`,
                    inline: true
                },

                {
                    name: "🏅 Novo cargo",
                    value: `${novoCargo.emoji} ${novoCargo.nome}`,
                    inline: true
                },

                {
                    name: "🛡 Responsável",
                    value: `${interaction.user}`,
                    inline: false
                }

            )

            .setThumbnail(
                membro.user.displayAvatarURL({
                    dynamic: true,
                    size: 256
                })
            )

            .setFooter({
                text: "🇮🇹 Padre Nosso MC"
            })

            .setTimestamp();

        const mensagemEnviada = await canal.send({
    embeds: [embed]
});
console.log("Mensagem enviada com sucesso.");
console.log(
    "✅ Log de promoção enviado:",
    mensagemEnviada.id,
    "no canal:",
    canal.name
);

    } catch (error) {

        console.error(
            "Erro ao enviar log de promoção:",
            error
        );

    }

}

// ======================================================
// COMANDO
// ======================================================

module.exports = {

    data: new SlashCommandBuilder()

        .setName("promover")

        .setDescription("Promove um integrante para o próximo cargo")

        .addUserOption(option =>

            option

                .setName("membro")

                .setDescription("Selecione o integrante que será promovido")

                .setRequired(true)

        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageRoles
        ),

    async execute(interaction) {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {

            const membro = interaction.options.getMember("membro");

            // ==================================================
            // VALIDAR MEMBRO
            // ==================================================

            if (!membro) {

                await interaction.editReply({
                    content: "❌ Não foi possível encontrar esse integrante no servidor."
                });

                apagarResposta(interaction);

                return;

            }

            if (membro.user.bot) {

                await interaction.editReply({
                    content: "❌ Bots não podem ser promovidos."
                });

                apagarResposta(interaction);

                return;

            }

            if (membro.id === interaction.user.id) {

                await interaction.editReply({
                    content: "❌ Você não pode promover a si mesmo."
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // BUSCAR CADASTRO
            // ==================================================

            const cadastro = await buscarMembro(membro.id);

            if (!cadastro) {

                await interaction.editReply({
                    content:
                        "❌ Esse integrante ainda não está cadastrado no sistema do motoclube."
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // IDENTIFICAR CARGO ATUAL
            // ==================================================

            const indiceAtual = hierarquia.findIndex(cargo =>
                membro.roles.cache.has(cargo.id)
            );

            if (indiceAtual === -1) {

                await interaction.editReply({
                    content:
                        "❌ Não foi possível identificar o cargo atual desse integrante."
                });

                apagarResposta(interaction);

                return;

            }

            const cargoAnterior = hierarquia[indiceAtual];

            // ==================================================
            // VALIDAR ÚLTIMO CARGO
            // ==================================================

            if (indiceAtual === hierarquia.length - 1) {

                await interaction.editReply({
                    content:
                        `⚠️ ${membro} já ocupa o cargo mais alto da hierarquia: ` +
                        `**${cargoAnterior.nome}**.`
                });

                apagarResposta(interaction);

                return;

            }

            const novoCargo = hierarquia[indiceAtual + 1];

            // ==================================================
            // VALIDAR CONFIGURAÇÃO
            // ==================================================

            if (!novoCargo.id) {

                await interaction.editReply({
                    content:
                        `❌ O ID do cargo **${novoCargo.nome}** não está configurado corretamente.`
                });

                apagarResposta(interaction);

                return;

            }

            const cargoDiscordNovo =
                interaction.guild.roles.cache.get(novoCargo.id);

            if (!cargoDiscordNovo) {

                await interaction.editReply({
                    content:
                        `❌ O cargo **${novoCargo.nome}** não foi encontrado no servidor.`
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // VALIDAR HIERARQUIA DO BOT
            // ==================================================

            const botMembro = interaction.guild.members.me;

            if (
                !botMembro ||
                botMembro.roles.highest.position <= cargoDiscordNovo.position
            ) {

                await interaction.editReply({
                    content:
                        `❌ O cargo do bot precisa estar acima de **${novoCargo.nome}** ` +
                        "na lista de cargos do servidor."
                });

                apagarResposta(interaction);

                return;

            }

            // ==================================================
            // TROCAR CARGOS NO DISCORD
            // ==================================================

            const cargosDaHierarquia = hierarquia
                .map(cargo => cargo.id)
                .filter(id =>
                    id &&
                    membro.roles.cache.has(id) &&
                    id !== novoCargo.id
                );

            if (cargosDaHierarquia.length > 0) {

                await membro.roles.remove(
                    cargosDaHierarquia,
                    `Promoção realizada por ${interaction.user.tag}`
                );

            }

            await membro.roles.add(
                novoCargo.id,
                `Promoção realizada por ${interaction.user.tag}`
            );

            // ==================================================
            // ATUALIZAR BANCO DE DADOS
            // ==================================================

            try {

                await atualizarCargo(
                    membro.id,
                    novoCargo.nome
                );

                await adicionarPromocao(
                    membro.id
                );

            } catch (databaseError) {

                /*
                 * Caso o Discord seja atualizado, mas o banco falhe,
                 * tenta restaurar o cargo anterior.
                 */

                try {

                    await membro.roles.remove(novoCargo.id);

                    await membro.roles.add(cargoAnterior.id);

                } catch (rollbackError) {

                    console.error(
                        "Erro ao restaurar cargo após falha no banco:",
                        rollbackError
                    );

                }

                throw databaseError;

            }

            // ==================================================
            // LOG
            // ==================================================

            console.log("========== PROMOÇÃO ==========");
console.log("Entrou na função de log.");

await enviarLogPromocao({
    interaction,
    membro,
    cargoAnterior,
    novoCargo
});

console.log("Saiu da função de log.");

            // ==================================================
            // RESPOSTA
            // ==================================================

            const embedSucesso = new EmbedBuilder()

                .setColor(COLORS.VERDE)

                .setTitle("✅ Promoção concluída")

                .setDescription(
                    `${membro} foi promovido com sucesso.`
                )

                .addFields(

                    {
                        name: "Cargo anterior",
                        value:
                            `${cargoAnterior.emoji} ${cargoAnterior.nome}`,
                        inline: true
                    },

                    {
                        name: "Novo cargo",
                        value:
                            `${novoCargo.emoji} ${novoCargo.nome}`,
                        inline: true
                    }

                )

                .setFooter({
                    text: "🇮🇹 Padre Nosso MC"
                })

                .setTimestamp();

            await interaction.editReply({
                embeds: [embedSucesso]
            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro no comando /promover:",
                error
            );

            try {

                await interaction.editReply({
                    content:
                        "❌ Ocorreu um erro ao realizar a promoção. Verifique o console do bot."
                });

                apagarResposta(interaction);

            } catch (replyError) {

                console.error(
                    "Erro ao responder interação:",
                    replyError
                );

            }

        }

    }

};