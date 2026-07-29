const { alterarCargo } = require("../services/cargoService");

async function handleRebaixarMenu(interaction) {

    if (!interaction.isStringSelectMenu()) return;

    if (!interaction.customId.startsWith("rebaixar_")) return;

    const membroId = interaction.customId.split("_")[1];

    const membro = await interaction.guild.members.fetch(membroId);

    const cargoSelecionado = interaction.values[0];

    const nomeCargo = await alterarCargo(

        interaction,

        membro,

        cargoSelecionado,

        "Rebaixamento"

    );

    await interaction.update({

        content: `⬇️ ${membro} rebaixado para **${nomeCargo}**.`,

        components: []

    });

}

module.exports = {
    handleRebaixarMenu
};