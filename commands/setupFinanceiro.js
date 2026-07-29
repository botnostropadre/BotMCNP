const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { obterSaldo } = require("../services/financeiroService");
const { criarFinanceiro } = require("../embeds/financeiroEmbed");
const { criarFinanceiroButtons } = require("../buttons/financeiroButtons");
const { salvarPainel } = require("../database/painelRepository");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setupfinanceiro")

        .setDescription("Cria o painel financeiro.")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const saldo = await obterSaldo();

        const mensagem = await interaction.channel.send({

            embeds: [

                criarFinanceiro(saldo)

            ],

            components: criarFinanceiroButtons()

        });

        await salvarPainel(

            "financeiro",

            interaction.channel.id,

            mensagem.id

        );

        await interaction.reply({

            content:
                "✅ Painel financeiro criado com sucesso.",

            ephemeral: true

        });

    }

};