const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

// ======================================================
// MENU DOS PARTICIPANTES
// ======================================================

function criarAcaoKillsMenu(
    acaoMarcadaId,
    participantes,
    killsRegistradas = []
) {

    const titulares =
        participantes.filter(
            participante =>
                Number(
                    participante.participou
                ) === 1
        );

    const menu =
        new StringSelectMenuBuilder()

            .setCustomId(
                `acao_kills_participante_${acaoMarcadaId}`
            )

            .setPlaceholder(
                "Selecione o participante"
            );

    menu.addOptions(

        titulares.map(
            participante => {

                const registro =
                    killsRegistradas.find(
                        item =>
                            item.discordId ===
                            participante.discordId
                    );

                return {

                    label:
                        participante.nome
                            .slice(
                                0,
                                100
                            ),

                    description:
                        registro
                            ? `✅ Registrado: ${registro.kills} kill(s)`
                            : "⏳ Aguardando lançamento",

                    value:
                        participante.discordId

                };

            }
        )

    );

    return new ActionRowBuilder()
        .addComponents(
            menu
        );

}

module.exports = {
    criarAcaoKillsMenu
};