const db = require("../database/database");
const settings = require("../config/settings.json");

async function registrarAdvertencia(interaction, membroId, motivo, gravidade) {

    const data = new Date().toLocaleString("pt-BR");

    return new Promise((resolve, reject) => {

        db.run(
            `INSERT INTO advertencias
            (discordId, motivo, gravidade, responsavel, data)
            VALUES (?, ?, ?, ?, ?)`,
            [
                membroId,
                motivo,
                gravidade,
                interaction.user.tag,
                data
            ],
            function(err) {

                if (err) return reject(err);

                db.get(
                    "SELECT COUNT(*) AS total FROM advertencias WHERE discordId = ?",
                    [membroId],
                    async (err, row) => {

                        if (err) return reject(err);

                        const canal = interaction.guild.channels.cache.get(settings.canais.logs);

                        if (canal) {

                            await canal.send({

                                embeds: [{

                                    color: 0xF1C40F,

                                    title: "⚠️ Nova Advertência",

                                    fields: [

                                        {
                                            name: "👤 Membro",
                                            value: `<@${membroId}>`,
                                            inline: true
                                        },

                                        {
                                            name: "📄 Motivo",
                                            value: motivo,
                                            inline: false
                                        },

                                        {
                                            name: "🚨 Gravidade",
                                            value: gravidade,
                                            inline: true
                                        },

                                        {
                                            name: "📊 Total",
                                            value: `${row.total} advertência(s)`,
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

                        resolve(row.total);

                    }
                );

            }
        );

    });

}

module.exports = {
    registrarAdvertencia
};