const db = require("../database/database");
const { EmbedBuilder } = require("discord.js");
const COLORS = require("../config/colors");
const { criarMenuMembros } = require("../buttons/membrosButtons");
const { obterSaldo } = require("../services/financeiroService");
const { criarFinanceiro } = require("../embeds/financeiroEmbed");
const { criarFinanceiroButtons } = require("../buttons/financeiroButtons");

async function handleDashboard(interaction) {

    if (!interaction.isButton()) return;

    switch (interaction.customId) {

        case "dash_membros": {

    const embed = new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle("🏍 Padre Nosso MC")

        .setDescription(
`# 👥 Gestão de Membros

Escolha uma opção abaixo.

➕ Registrar novos membros

⬆ Promover cargos

⬇ Rebaixar cargos

⚠ Aplicar advertências

📋 Consultar ficha

🗑 Demitir membros`
        )

        .setFooter({

            text: "Painel Administrativo"

        });

    await interaction.update({

        embeds: [embed],

        components: criarMenuMembros()

    });

}

break;
case "dashboard": {

    db.all(

        "SELECT cargo FROM membros",

        async (err, rows) => {

            const stats = {

                total: rows.length,

                prospect: rows.filter(x => x.cargo === "Prospect").length,

                membro: rows.filter(x => x.cargo === "Membro").length,

                diretoria: rows.filter(x =>
                    ["Presidente", "Vice", "Secretário", "Sargento de Armas"]
                    .includes(x.cargo)
                ).length,

                advertencias: 0

            };

            const { criarDashboard } = require("../embeds/dashboardEmbed");

            const { criarDashboardButtons } = require("../buttons/dashboardButtons");

            await interaction.update({

                embeds: [criarDashboard(stats)],

                components: criarDashboardButtons()

            });

        }

    );

}

break;

            
        case "dash_financeiro": {

    const saldo = await obterSaldo();

    await interaction.update({

        embeds: [

            criarFinanceiro(saldo)

        ],

        components: criarFinanceiroButtons()

    });
    const {

    salvarPainel

} = require("../database/painelRepository");

const resposta = await interaction.fetchReply();

salvarPainel(

    "financeiro",

    interaction.channel.id,

    resposta.id

);

}

break;

    }

}

module.exports = {

    handleDashboard

};