const { registrar } = require("../services/registroService");

const COLORS = require("../config/colors");
const settings = require("../config/settings.json");

const {
    registrarEntrada,
    registrarSaida
} = require("../services/financeiroService");

const {
    atualizarPainelFinanceiro
} = require("../services/atualizarFinanceiro");

const {
    atualizarEditor,
    adicionarCampo
} = require("../services/embedBuilderService");

const {
    gerarStatusEditor
} = require("../services/embedStatusService");

const {
    criarEditorButtons
} = require("../buttons/embedEditorButtons");

// ======================================================
// APAGAR RESPOSTA APÓS 10 SEGUNDOS
// ======================================================

function apagarResposta(interaction) {

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch {

            // A resposta pode já ter sido apagada.

        }

    }, 10000);

}

// ======================================================
// APAGAR MENSAGEM TEMPORÁRIA
// ======================================================

function apagarMensagem(mensagem, tempo = 10000) {

    setTimeout(async () => {

        try {

            await mensagem.delete();

        } catch {

            // A mensagem pode já ter sido apagada.

        }

    }, tempo);

}

// ======================================================
// ATUALIZAR PAINEL DO EDITOR
// ======================================================

async function atualizarPainelEditor(
    interaction,
    mensagemSucesso
) {

    const painel = gerarStatusEditor(
        interaction.user.id,
        interaction.guild
    );

    if (!painel) {

        await interaction.reply({
            content:
                "❌ Nenhum editor de embed foi encontrado.",
            flags: 64
        });

        apagarResposta(interaction);

        return;

    }

    /*
     * Quando o modal foi aberto por um botão ou menu,
     * interaction.message representa o painel original.
     */
    if (interaction.message) {

        await interaction.update({
            embeds: [painel],
            components: criarEditorButtons()
        });

    } else {

        await interaction.reply({
            embeds: [painel],
            components: criarEditorButtons(),
            flags: 64
        });

    }

    const confirmacao = await interaction.followUp({
        content: mensagemSucesso,
        flags: 64
    });

    apagarMensagem(confirmacao);

}

// ======================================================
// HANDLER DE MODAIS
// ======================================================

async function handleModal(interaction) {

    if (!interaction.isModalSubmit()) return;

    // ==================================================
    // FINANCEIRO — ENTRADA E SAÍDA
    // ==================================================

    if (
        interaction.customId.startsWith(
            "financeiro_entrada_"
        ) ||
        interaction.customId.startsWith(
            "financeiro_saida_"
        )
    ) {

        const tipo = interaction.customId.startsWith(
            "financeiro_entrada_"
        )
            ? "entrada"
            : "saida";

        const categoria = interaction.customId.replace(
            `financeiro_${tipo}_`,
            ""
        );

        const valorTexto =
            interaction.fields.getTextInputValue(
                "valor"
            );

        const valor = Number(
            valorTexto
                .replace(/\./g, "")
                .replace(",", ".")
        );

        const descricao =
            interaction.fields.getTextInputValue(
                "descricao"
            );

        if (
            !Number.isFinite(valor) ||
            valor <= 0
        ) {

            await interaction.reply({
                content:
                    "❌ Informe um valor válido.",
                flags: 64
            });

            apagarResposta(interaction);

            return;

        }

        try {

            if (tipo === "entrada") {

                await registrarEntrada(
                    valor,
                    categoria,
                    descricao,
                    interaction.user.username
                );

            } else {

                await registrarSaida(
                    valor,
                    categoria,
                    descricao,
                    interaction.user.username
                );

            }

            await atualizarPainelFinanceiro(
                interaction.client
            );

            const canalLogs =
                interaction.guild.channels.cache.get(
                    settings.canais.logs
                );

            if (
                canalLogs &&
                canalLogs.isTextBased()
            ) {

                await canalLogs.send({
                    embeds: [
                        {
                            color:
                                tipo === "entrada"
                                    ? COLORS.VERDE
                                    : COLORS.VERMELHO,

                            title:
                                tipo === "entrada"
                                    ? "📥 Nova Entrada Financeira"
                                    : "📤 Nova Saída Financeira",

                            fields: [
                                {
                                    name: "💵 Valor",

                                    value:
                                        valor.toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL"
                                            }
                                        ),

                                    inline: true
                                },
                                {
                                    name: "📂 Categoria",

                                    value: categoria,

                                    inline: true
                                },
                                {
                                    name: "📝 Descrição",

                                    value:
                                        descricao ||
                                        "Nenhuma descrição informada.",

                                    inline: false
                                },
                                {
                                    name: "👤 Responsável",

                                    value:
                                        `${interaction.user}`,

                                    inline: false
                                }
                            ],

                            footer: {
                                text:
                                    "🇮🇹 Padre Nosso MC"
                            },

                            timestamp:
                                new Date().toISOString()
                        }
                    ]
                });

            }

            await interaction.reply({
                content:
                    `✅ ${
                        tipo === "entrada"
                            ? "Entrada"
                            : "Saída"
                    } registrada com sucesso!\n\n` +
                    `💰 Valor: **${valor.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    )}**\n` +
                    `📂 Categoria: **${categoria}**`,

                flags: 64
            });

            apagarResposta(interaction);

        } catch (error) {

            console.error(
                "Erro ao registrar movimentação financeira:",
                error
            );

            await interaction.reply({
                content:
                    "❌ Ocorreu um erro ao registrar a movimentação financeira.",

                flags: 64
            });

            apagarResposta(interaction);

        }

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — TÍTULO
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_titulo"
    ) {

        const titulo =
            interaction.fields.getTextInputValue(
                "titulo"
            );

        atualizarEditor(
            interaction.user.id,
            {
                titulo
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Título salvo com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — DESCRIÇÃO
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_descricao"
    ) {

        const descricao =
            interaction.fields.getTextInputValue(
                "descricao"
            );

        atualizarEditor(
            interaction.user.id,
            {
                descricao
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Descrição salva com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — COR
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_cor"
    ) {

        let cor =
            interaction.fields
                .getTextInputValue("cor")
                .trim();

        if (!cor.startsWith("#")) {

            cor = `#${cor}`;

        }

        const regex =
            /^#[0-9A-Fa-f]{6}$/;

        if (!regex.test(cor)) {

            await interaction.reply({
                content:
                    "❌ Informe uma cor HEX válida.\n\n" +
                    "Exemplo: **#57F287**",

                flags: 64
            });

            apagarResposta(interaction);

            return;

        }

        atualizarEditor(
            interaction.user.id,
            {
                cor
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Cor atualizada com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — FAIXA
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_faixa"
    ) {

        const url =
            interaction.fields
                .getTextInputValue("url")
                .trim();

        try {

            new URL(url);

        } catch {

            await interaction.reply({
                content:
                    "❌ Informe uma URL válida para a faixa.",

                flags: 64
            });

            apagarResposta(interaction);

            return;

        }

        atualizarEditor(
            interaction.user.id,
            {
                faixa: url
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Faixa atualizada com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — RODAPÉ
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_rodape"
    ) {

        const texto =
            interaction.fields
                .getTextInputValue("texto")
                .trim();

        atualizarEditor(
            interaction.user.id,
            {
                rodape: texto
            }
        );

        await atualizarPainelEditor(
            interaction,
            "✅ Rodapé atualizado com sucesso."
        );

        return;

    }

    // ==================================================
    // EDITOR DE EMBEDS — CAMPO
    // ==================================================

    if (
        interaction.customId ===
        "embed_modal_campo"
    ) {

        const nome =
            interaction.fields.getTextInputValue(
                "nome"
            );

        const valor =
            interaction.fields.getTextInputValue(
                "valor"
            );

        const inlineTexto =
            interaction.fields
                .getTextInputValue("inline")
                .trim()
                .toLowerCase();

        const inline = [
            "sim",
            "s",
            "yes",
            "true",
            "1"
        ].includes(inlineTexto);

        try {

            adicionarCampo(
                interaction.user.id,
                {
                    name: nome,
                    value: valor,
                    inline
                }
            );

            await atualizarPainelEditor(
                interaction,
                "✅ Campo adicionado com sucesso."
            );

        } catch (error) {

            await interaction.reply({
                content:
                    `❌ ${error.message}`,

                flags: 64
            });

            apagarResposta(interaction);

        }

        return;

    }

    // ==================================================
    // REGISTRO DE MEMBROS
    // ==================================================

    if (
        interaction.customId ===
        "registroModal"
    ) {

        const nome =
            interaction.fields
                .getTextInputValue("nome")
                .trim();

        const vulgo =
            interaction.fields
                .getTextInputValue("vulgo")
                .trim();

        const sobrenome =
            interaction.fields
                .getTextInputValue("sobrenome")
                .trim();

        const secretario =
            interaction.fields
                .getTextInputValue("secretario")
                .trim();

        try {

            await registrar(
                interaction,
                {
                    nome,
                    vulgo,
                    sobrenome,
                    secretario
                }
            );

            await interaction.reply({
                content:
                    "✅ Registro realizado com sucesso!\n\n" +
                    "Bem-vindo ao Padre Nosso MC.",

                flags: 64
            });

        } catch (error) {

            console.error(
                "Erro ao registrar integrante:",
                error
            );

            await interaction.reply({
                content:
                    `❌ ${
                        error.message ||
                        "Não foi possível realizar o registro."
                    }`,

                flags: 64
            });

        }

        apagarResposta(interaction);

        return;

    }

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    handleModal
};