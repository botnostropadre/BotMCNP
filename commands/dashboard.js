const {

SlashCommandBuilder,
PermissionFlagsBits

} = require("discord.js");

const db = require("../database/database");

const { criarDashboard } = require("../embeds/dashboardEmbed");

const { criarDashboardButtons } = require("../buttons/dashboardButtons");

module.exports = {

data: new SlashCommandBuilder()

.setName("dashboard")

.setDescription("Painel administrativo")

.setDefaultMemberPermissions(

PermissionFlagsBits.ManageRoles

),

async execute(interaction){

db.all(

"SELECT cargo FROM membros",

async (err, rows)=>{

if(err) return;

const stats={

total:rows.length,

prospect:rows.filter(x=>x.cargo==="Prospect").length,

membro:rows.filter(x=>x.cargo==="Membro").length,

diretoria:rows.filter(x=>

["Presidente","Vice","Secretário","Sargento de Armas"]

.includes(x.cargo)

).length,

advertencias:0

};

await interaction.reply({

embeds:[criarDashboard(stats)],

components:criarDashboardButtons(),

ephemeral:true

});

}

);

}

};