const db = require("../database/database");
const settings = require("../config/settings.json");
const hierarquia = require("../config/hierarquia");
const COLORS = require("../config/colors");

async function alterarCargo(interaction, membro, novoCargoId, acao) {

    // Remove todos os cargos do MC
    for (const cargo of hierarquia) {

        if (membro.roles.cache.has(cargo.id)) {
            await membro.roles.remove(cargo.id);
        }

    }

    // Adiciona o novo cargo
    await membro.roles.add(novoCargoId);

    const cargo = hierarquia.find(c => c.id === novoCargoId);

    // Atualiza banco
    db.run(
        "UPDATE membros SET cargo = ? WHERE discordId = ?",
        [cargo.nome, membro.id]
    );

    // Canal de logs
    const canal = interaction.guild.channels.cache.get(settings.canais.logs);

    if (canal) {

        await canal.send({

            embeds: [{

                color: acao === "Promoção" ? 0x2ECC71 : 0xE67E22,

                title: acao === "Promoção"
                    ? "⬆️ Promoção"
                    : "⬇️ Rebaixamento",

                fields: [

                    {
                        name: "👤 Membro",
                        value: `${membro}`,
                        inline: true
                    },

                    {
                        name: "🎖 Novo Cargo",
                        value: cargo.nome,
                        inline: true
                    },

                    {
                        name: "👮 Responsável",
                        value: `${interaction.user}`,
                        inline: false
                    }

                ],

                timestamp: new Date()

            }]

        });

    }

    return cargo.nome;

}

module.exports = {
    alterarCargo
};