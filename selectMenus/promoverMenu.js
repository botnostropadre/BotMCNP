const {
    alterarCargo
} = require("../services/cargoService");

// ======================================================
// MENU DE PROMOÇÃO
// ======================================================

async function handlePromoverMenu(interaction) {

    if (!interaction.isStringSelectMenu()) return;

    if (
        !interaction.customId.startsWith(
            "promover_"
        )
    ) {

        return;

    }

    try {

        const membroId =
            interaction.customId.split("_")[1];

        const membro =
            await interaction.guild.members
                .fetch(membroId)
                .catch(() => null);

        if (!membro) {

            await interaction.update({

                content:
                    "❌ Não foi possível localizar esse integrante no servidor.",

                components: []

            });

            return;

        }

        const cargoSelecionado =
            interaction.values[0];

        const nomeCargo =
            await alterarCargo(
                interaction,
                membro,
                cargoSelecionado,
                "Promoção"
            );

        await interaction.update({

            content:
                `✅ ${membro} foi promovido para **${nomeCargo}**.`,

            components: []

        });

    } catch (error) {

        console.error(
            "Erro ao processar menu de promoção:",
            error
        );

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            await interaction.update({

                content:
                    "❌ Não foi possível concluir a promoção.",

                components: []

            }).catch(() => {});

        }

    }

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    handlePromoverMenu
};