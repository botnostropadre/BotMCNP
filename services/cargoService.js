const db = require("../database/database");
const settings = require("../config/settings.json");
const hierarquia = require("../config/hierarquia");
const COLORS = require("../config/colors");

// ======================================================
// ATUALIZAR CARGO NO BANCO
// ======================================================

function atualizarCargoBanco(
    discordId,
    nomeCargo
) {

    return new Promise(
        (resolve, reject) => {

            db.run(
                `
                    UPDATE membros
                    SET cargo = ?
                    WHERE discordId = ?
                `,
                [
                    nomeCargo,
                    discordId
                ],
                function (error) {

                    if (error) {

                        return reject(error);

                    }

                    resolve(this);

                }
            );

        }
    );

}

// ======================================================
// ALTERAR CARGO DO INTEGRANTE
// ======================================================

async function alterarCargo(
    interaction,
    membro,
    novoCargoId,
    acao
) {

    if (!interaction.guild) {

        throw new Error(
            "Esta ação só pode ser realizada dentro do servidor."
        );

    }

    if (!membro) {

        throw new Error(
            "O integrante não foi encontrado no servidor."
        );

    }

    const cargoSelecionado =
        hierarquia.find(
            cargo =>
                cargo.id === novoCargoId
        );

    if (!cargoSelecionado) {

        throw new Error(
            "O cargo selecionado não pertence à hierarquia da organização."
        );

    }

    const cargoDiscord =
        interaction.guild.roles.cache.get(
            novoCargoId
        ) ||
        await interaction.guild.roles
            .fetch(novoCargoId)
            .catch(() => null);

    if (!cargoDiscord) {

        throw new Error(
            `O cargo ${cargoSelecionado.nome} não foi encontrado no servidor.`
        );

    }

    const botMembro =
        interaction.guild.members.me;

    if (
        !botMembro ||
        botMembro.roles.highest.position <=
        cargoDiscord.position
    ) {

        throw new Error(
            `O cargo do bot precisa estar acima de ${cargoSelecionado.nome} na lista de cargos.`
        );

    }

    // ==================================================
    // LOCALIZAR CARGOS ATUAIS DA HIERARQUIA
    // ==================================================

    const cargosParaRemover =
        hierarquia
            .map(cargo => cargo.id)
            .filter(cargoId =>
                cargoId &&
                cargoId !== novoCargoId &&
                membro.roles.cache.has(cargoId)
            );

    // ==================================================
    // REMOVER CARGOS ANTERIORES
    // ==================================================

    if (cargosParaRemover.length > 0) {

        await membro.roles.remove(
            cargosParaRemover,
            `${acao} realizada por ${interaction.user.tag}`
        );

    }

    // ==================================================
    // ADICIONAR NOVO CARGO
    // ==================================================

    if (
        !membro.roles.cache.has(
            novoCargoId
        )
    ) {

        await membro.roles.add(
            cargoDiscord,
            `${acao} realizada por ${interaction.user.tag}`
        );

    }

    // ==================================================
    // ATUALIZAR BANCO
    // ==================================================

    try {

        await atualizarCargoBanco(
            membro.id,
            cargoSelecionado.nome
        );

    } catch (error) {

        console.error(
            "Erro ao atualizar cargo no banco:",
            error
        );

        /*
         * Remove o cargo recém-adicionado caso
         * a atualização do banco não seja concluída.
         */

        await membro.roles.remove(
            cargoDiscord,
            "Reversão após falha no banco de dados"
        ).catch(() => {});

        throw new Error(
            "O cargo foi alterado no Discord, mas não foi possível atualizar o banco de dados."
        );

    }

    // ==================================================
    // DEFINIR CANAL DE LOG
    // ==================================================

    const canalId =
        acao === "Promoção"
            ? settings.canais?.promocoes
            : settings.canais?.rebaixamentos;

    if (canalId) {

        try {

            const canal =
                interaction.guild.channels.cache.get(
                    canalId
                ) ||
                await interaction.guild.channels
                    .fetch(canalId)
                    .catch(() => null);

            if (
                canal &&
                canal.isTextBased()
            ) {

                await canal.send({

                    embeds: [

                        {

                            color:
                                acao === "Promoção"
                                    ? COLORS.VERDE
                                    : COLORS.VERMELHO,

                            title:
                                acao === "Promoção"
                                    ? "⬆️ Promoção realizada"
                                    : "⬇️ Rebaixamento realizado",

                            description:
                                `${membro} teve seu cargo atualizado dentro da ${settings.mc.nome}.`,

                            fields: [

                                {
                                    name:
                                        "👤 Integrante",

                                    value:
                                        `${membro}`,

                                    inline:
                                        false
                                },

                                {
                                    name:
                                        "🎖 Novo cargo",

                                    value:
                                        `${cargoSelecionado.emoji} ${cargoSelecionado.nome}`,

                                    inline:
                                        true
                                },

                                {
                                    name:
                                        "🛡 Responsável",

                                    value:
                                        `${interaction.user}`,

                                    inline:
                                        false
                                }

                            ],

                            footer: {

                                text:
                                    `${settings.mc.nome} • Gestão de Integrantes`

                            },

                            timestamp:
                                new Date().toISOString()

                        }

                    ]

                });

            }

        } catch (error) {

            console.error(
                `Erro ao enviar log de ${acao.toLowerCase()}:`,
                error
            );

        }

    }

    return cargoSelecionado.nome;

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    alterarCargo
};