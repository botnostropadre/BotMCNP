const { registrarAdvertencia } = require("../services/advertenciaService");
const { criarMenuGravidade } = require("../selectMenus/gravidadeMenu");

async function handleAdvertenciaModal(interaction) {

    if (!interaction.isModalSubmit()) return;

    if (!interaction.customId.startsWith("advertencia_")) return;

    const membroId = interaction.customId.split("_")[1];

    const motivo = interaction.fields.getTextInputValue("motivo");

   

    try {

        const menu = criarMenuGravidade(

    membroId,

    motivo

);

await interaction.reply({

    content:

    "Selecione a gravidade da advertência.",

    components: [menu],

    ephemeral: true

});

        let mensagem = `✅ Advertência registrada.\n\nTotal: **${total}** advertência(s).`;

        if (total >= 3) {

            mensagem += "\n\n🚨 Este membro atingiu **3 advertências**.";

        }

        await interaction.reply({

            content: mensagem,

            ephemeral: true

        });

    } catch (erro) {

        console.error(erro);

        await interaction.reply({

            content: "❌ Erro ao registrar advertência.",

            ephemeral: true

        });

    }

}

module.exports = {
    handleAdvertenciaModal
};