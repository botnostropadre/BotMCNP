const { alterarCargo } = require("../services/cargoService");

async function handlePromoverMenu(interaction) {

    if (!interaction.isStringSelectMenu()) return;

    if (!interaction.customId.startsWith("promover_")) return;

    const membroId = interaction.customId.split("_")[1];

    const membro = await interaction.guild.members.fetch(membroId);

    const cargoSelecionado = interaction.values[0];

        const nomeCargo = await alterarCargo(
        interaction,
        membro,
        cargoSelecionado,
        "Promoção"
    );

    await interaction.update({

        content: `✅ ${membro} promovido para **${nomeCargo}**.`,

        components: []

    });

}
module.exports = { handlePromoverMenu };