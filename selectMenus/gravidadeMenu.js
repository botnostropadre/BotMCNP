const {
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");

function criarMenuGravidade(membroId, motivo) {

    const menu = new StringSelectMenuBuilder()

        .setCustomId(`gravidade_${membroId}_${Buffer.from(motivo).toString("base64")}`)

        .setPlaceholder("Selecione a gravidade")

        .addOptions(

            {

                label: "Leve",

                value: "Leve",

                emoji: "🟢"

            },

            {

                label: "Média",

                value: "Média",

                emoji: "🟡"

            },

            {

                label: "Grave",

                value: "Grave",

                emoji: "🔴"

            }

        );

    return new ActionRowBuilder()

        .addComponents(menu);

}

module.exports = {

    criarMenuGravidade

};