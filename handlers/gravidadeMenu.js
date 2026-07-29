const { registrarAdvertencia } = require("../services/advertenciaService");

async function handleGravidadeMenu(interaction) {

    if (!interaction.isStringSelectMenu()) return;

    if (!interaction.customId.startsWith("gravidade_")) return;

    const partes = interaction.customId.split("_");

    const membroId = partes[1];

    const motivo = Buffer.from(partes[2], "base64").toString();

    const gravidade = interaction.values[0];

    try {

        const total = await registrarAdvertencia(
            interaction,
            membroId,
            motivo,
            gravidade
        );

        let mensagem = `✅ Advertência aplicada.\n\nTotal: **${total}**`;

        if (total >= 3) {

            mensagem += "\n\n🚨 Este membro atingiu 3 advertências.";

        }

        await interaction.update({

            content: mensagem,

            components: []

        });

    } catch (erro) {

        console.error(erro);

    }

}

module.exports = {

    handleGravidadeMenu

};