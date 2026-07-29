const { buscarPainel } = require("../database/painelRepository");
const { obterSaldo } = require("./financeiroService");
const { criarFinanceiro } = require("../embeds/financeiroEmbed");
const { criarFinanceiroButtons } = require("../buttons/financeiroButtons");

async function atualizarPainelFinanceiro(client) {

    const painel = await buscarPainel("financeiro");

    if (!painel) {

        console.log("❌ Painel financeiro não encontrado.");

        return;

    }

    try {

        const canal = await client.channels.fetch(
            painel.canalId
        );

        const mensagem = await canal.messages.fetch(
            painel.mensagemId
        );

        const saldo = await obterSaldo();

        await mensagem.edit({

            embeds: [

                criarFinanceiro(saldo)

            ],

            components: criarFinanceiroButtons()

        });

        console.log("✅ Painel atualizado.");

    } catch (err) {

        console.error(err);

    }

}

module.exports = {

    atualizarPainelFinanceiro

};