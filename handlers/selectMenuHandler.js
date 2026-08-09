const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const {
    criarModalCor
} = require("../modals/embedCorModal");

const {
    criarModalImagem
} = require("../modals/embedImagemModal");

const {
    criarModalRodape
} = require("../modals/embedRodapeModal");

const {
    atualizarEditor
} = require("../services/embedBuilderService");

const db = require("../database/database");

const settings = require("../config/settings.json");
// ======================================================
// APAGAR RESPOSTA TEMPORÁRIA
// ======================================================

function apagarResposta(interaction, tempo = 10000) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {}

    }, tempo);

}

// ======================================================
// HANDLER DE MENUS DE SELEÇÃO
// ======================================================

async function handleSelectMenu(interaction) {

    if (
        !interaction.isStringSelectMenu() &&
        !interaction.isChannelSelectMenu()
    ) {

        return;

    }
// ==================================================
// REGISTRO — SELECIONAR CARGO
// ==================================================

if (
    interaction.isStringSelectMenu() &&
    interaction.customId.startsWith(
        "registro_cargo_"
    )
) {

    const registroId =
        interaction.customId.replace(
            "registro_cargo_",
            ""
        );

    const cargoId =
        interaction.values[0];

    const cargos = {

    [settings.cargos.eliteTeste]:
        "Elite Teste",

    [settings.cargos.treinamento]:
        "Treinamento",

    [settings.cargos.membro]:
        "Membro",

    [settings.cargos.recrutamento]:
        "Recrutamento",

    [settings.cargos.respEventos]:
        "Resp. Eventos",

    [settings.cargos.respElite]:
        "Resp. Elite",

    [settings.cargos.gerencia]:
        "Gerência",

    [settings.cargos.viceLideranca]:
        "Vice Liderança",

    [settings.cargos.lideranca]:
        "Liderança"

};

    const cargoNome =
        cargos[cargoId];

    if (!cargoNome) {

        await interaction.reply({

            content:
                "❌ O cargo selecionado não é válido.",

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

    try {

        const registro =
            await new Promise(
                (resolve, reject) => {

                    db.get(
                        `
                            SELECT *
                            FROM registrosPendentes
                            WHERE id = ?
                        `,
                        [
                            registroId
                        ],
                        (
                            error,
                            row
                        ) => {

                            if (error) {

                                return reject(
                                    error
                                );

                            }

                            resolve(
                                row || null
                            );

                        }
                    );

                }
            );

        if (!registro) {

            await interaction.reply({

                content:
                    "❌ Esse registro não foi encontrado.",

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        if (
            registro.status !==
            "Pendente"
        ) {

            await interaction.reply({

                content:
                    `⚠️ Esse registro já foi ${registro.status.toLowerCase()}.`,

                flags: 64

            });

            apagarResposta(interaction);

            return;

        }

        await new Promise(
            (resolve, reject) => {

                db.run(
                    `
                        UPDATE registrosPendentes

                        SET
                            cargoSelecionadoId = ?,
                            cargoSelecionadoNome = ?

                        WHERE id = ?
                    `,
                    [
                        cargoId,
                        cargoNome,
                        registroId
                    ],
                    function (error) {

                        if (error) {

                            return reject(
                                error
                            );

                        }

                        resolve(this);

                    }
                );

            }
        );

        await interaction.reply({

            content:
                `✅ Cargo selecionado para aprovação: **${cargoNome}**.`,

            flags: 64

        });

        apagarResposta(interaction);

    } catch (error) {

        console.error(
            "Erro ao selecionar cargo do registro:",
            error
        );

        await interaction.reply({

            content:
                "❌ Não foi possível salvar o cargo selecionado.",

            flags: 64

        }).catch(() => {});

        apagarResposta(interaction);

    }

    return;

}
    // ==================================================
    // MENU VISUAL DO EMBED
    // ==================================================

    if (
        interaction.isStringSelectMenu() &&
        interaction.customId ===
        "embed_visual_menu"
    ) {

        const opcao = interaction.values[0];

        if (opcao === "cor") {

            return interaction.showModal(
                criarModalCor()
            );

        }

        if (opcao === "rodape") {

            return interaction.showModal(
                criarModalRodape()
            );

        }

        return;

    }

    // ==================================================
    // MENU DE IMAGEM DO EMBED
    // ==================================================

    if (
        interaction.isStringSelectMenu() &&
        interaction.customId ===
        "embed_imagem_menu"
    ) {

        const opcao = interaction.values[0];

        if (opcao === "faixa") {

            return interaction.showModal(
                criarModalImagem()
            );

        }

        return;

    }

    // ==================================================
    // SELEÇÃO DO CANAL DE PUBLICAÇÃO
    // ==================================================

    if (
        interaction.isChannelSelectMenu() &&
        interaction.customId ===
        "embed_canal_menu"
    ) {

        atualizarEditor(
            interaction.user.id,
            {
                canal: interaction.values[0]
            }
        );

        await interaction.reply({

            content:
                "✅ Canal salvo com sucesso.",

            flags: 64

        });

        apagarResposta(interaction);

        return;

    }

}

module.exports = {

    handleSelectMenu

};