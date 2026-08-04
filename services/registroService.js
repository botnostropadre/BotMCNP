const db = require("../database/database");
const settings = require("../config/settings.json");
const COLORS = require("../config/colors");

// ======================================================
// EXECUTAR COMANDO NO BANCO
// ======================================================

function executarBanco(sql, parametros = []) {

    return new Promise((resolve, reject) => {

        db.run(sql, parametros, function (error) {

            if (error) {
                return reject(error);
            }

            resolve(this);

        });

    });

}

// ======================================================
// REGISTRAR INTEGRANTE
// ======================================================

async function registrar(interaction, dados) {

    const nome = dados.nome?.trim();
    const vulgo = dados.vulgo?.trim();
    const sobrenome = dados.sobrenome?.trim();
    const secretario = dados.secretario?.trim();

    // ==================================================
    // VALIDAR CAMPOS
    // ==================================================

    if (!nome || !vulgo || !sobrenome || !secretario) {

        throw new Error(
            "Todos os campos do registro precisam ser preenchidos."
        );

    }

    const nomeCompleto = `${nome} "${vulgo}" ${sobrenome}`;

    if (nomeCompleto.length > 32) {

        throw new Error(
            `O nome completo possui ${nomeCompleto.length} caracteres. ` +
            "O apelido do Discord permite no máximo 32 caracteres."
        );

    }

    if (!interaction.guild) {

        throw new Error(
            "O registro só pode ser realizado dentro do servidor."
        );

    }

    // ==================================================
    // BUSCAR INTEGRANTE
    // ==================================================

    let membro;

    try {

        membro = await interaction.guild.members.fetch(
            interaction.user.id
        );

    } catch (error) {

        console.error(
            "Erro ao buscar integrante durante o registro:",
            error
        );

        throw new Error(
            "Não foi possível localizar seu usuário no servidor."
        );

    }

    // ==================================================
    // VALIDAR CARGO TREINAMENTO
    // ==================================================

    const cargoTreinamentoId =
        settings.cargos?.treinamento;

    if (!cargoTreinamentoId) {

        throw new Error(
            "O ID do cargo Treinamento não está configurado no settings.json."
        );

    }

    const cargoTreinamento =
        await interaction.guild.roles
            .fetch(cargoTreinamentoId)
            .catch(() => null);

    if (!cargoTreinamento) {

        throw new Error(
            "O cargo Treinamento não foi encontrado no servidor. Verifique o ID no settings.json."
        );

    }

    // ==================================================
    // VALIDAR POSIÇÃO DO BOT
    // ==================================================

    const membroBot =
        interaction.guild.members.me;

    if (!membroBot) {

        throw new Error(
            "Não foi possível identificar o cargo do bot."
        );

    }

    if (
        membroBot.roles.highest.position <=
        cargoTreinamento.position
    ) {

        throw new Error(
            "O cargo do bot precisa estar acima do cargo Treinamento na lista de cargos do servidor."
        );

    }

    // ==================================================
    // VERIFICAR CADASTRO EXISTENTE
    // ==================================================

    const cadastroExistente = await new Promise(
        (resolve, reject) => {

            db.get(
                "SELECT discordId FROM membros WHERE discordId = ?",
                [interaction.user.id],
                (error, row) => {

                    if (error) {
                        return reject(error);
                    }

                    resolve(row);

                }
            );

        }
    ).catch(error => {

        console.error(
            "Erro ao verificar cadastro existente:",
            error
        );

        throw new Error(
            `Erro ao consultar o banco de dados: ${error.message}`
        );

    });

    if (cadastroExistente) {

        throw new Error(
            `Você já possui um registro no sistema da ${settings.mc.nome}.`
        );

    }

    // ==================================================
    // ALTERAR NICKNAME
    // ==================================================

    const nicknameAnterior =
        membro.nickname;

    try {

        await membro.setNickname(
            nomeCompleto,
            `Registro realizado por ${interaction.user.tag}`
        );

    } catch (error) {

        console.error(
            "Erro ao alterar nickname:",
            error
        );

        if (
            interaction.guild.ownerId ===
            membro.id
        ) {

            throw new Error(
                "O Discord não permite que o bot altere o apelido do dono do servidor."
            );

        }

        throw new Error(
            "Não foi possível alterar seu apelido. Coloque o cargo do bot acima do seu cargo e permita a opção Gerenciar Apelidos."
        );

    }

       // ==================================================
    // ADICIONAR CARGO TREINAMENTO
    // ==================================================

    try {

        await membro.roles.add(
            cargoTreinamento,
            `Registro realizado por ${interaction.user.tag}`
        );

    } catch (error) {

        console.error(
            "Erro ao adicionar cargo Treinamento:",
            error
        );

        try {

            await membro.setNickname(
                nicknameAnterior
            );

        } catch {}

        throw new Error(
            "Não foi possível adicionar o cargo Treinamento. Verifique a posição do cargo do bot e a permissão Gerenciar Cargos."
        );

    }

    // ==================================================
    // SALVAR NO BANCO
    // ==================================================

    const dataRegistro =
        new Date().toLocaleString("pt-BR");

    try {

        await executarBanco(
            `INSERT INTO membros (
                discordId,
                nome,
                vulgo,
                sobrenome,
                nomeCompleto,
                secretario,
                cargo,
                advertencias,
                promocoes,
                rebaixamentos,
                status,
                dataRegistro,
                ultimaPromocao,
                ultimaAdvertencia
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                interaction.user.id,
                nome,
                vulgo,
                sobrenome,
                nomeCompleto,
                secretario,
                "Treinamento",
                0,
                0,
                0,
                "Ativo",
                dataRegistro,
                null,
                null
            ]
        );

    } catch (error) {

        console.error(
            "Erro ao salvar registro no banco:",
            error
        );

        // Desfaz as alterações no Discord caso o banco falhe.

        try {

            await membro.roles.remove(
                cargoTreinamento
            );

        } catch {}

        try {

            await membro.setNickname(
                nicknameAnterior
            );

        } catch {}

        throw new Error(
            `Não foi possível salvar o registro no banco de dados: ${error.message}`
        );

    }

    // ==================================================
    // ENVIAR LOG
    // ==================================================

    const canalLogsId =
        settings.canais?.logs;

    if (canalLogsId) {

        try {

            const canalLogs =
                await interaction.guild.channels
                    .fetch(canalLogsId);

            if (
                canalLogs &&
                canalLogs.isTextBased()
            ) {

                await canalLogs.send({

                    embeds: [

                        {

                            color:
                                COLORS.VERDE,

                            title:
                                "📋 Novo Registro",

                            thumbnail: {

                                url:
                                    interaction.user
                                        .displayAvatarURL({
                                            size: 256
                                        })

                            },

                            fields: [

                                {

                                    name:
                                        "👤 Integrante",

                                    value:
                                        nomeCompleto,

                                    inline:
                                        false

                                },

                                {

                                    name:
                                        "🤝 Recrutamento responsável",

                                    value:
                                        secretario,

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "🎖 Cargo",

                                    value:
                                        "Treinamento",

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "📌 Status",

                                    value:
                                        "Ativo",

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "💬 Discord",

                                    value:
                                        `${interaction.user}`,

                                    inline:
                                        false

                                }

                            ],

                            footer: {

                                text:
                                    `${settings.mc.nome} • Sistema de Registro`

                            },

                            timestamp:
                                new Date().toISOString()

                        }

                    ]

                });

            }

        } catch (error) {

            // O registro continua válido mesmo se o canal de logs falhar.

            console.error(
                "Registro concluído, mas houve erro ao enviar o log:",
                error
            );

        }

    }

    return {

        nomeCompleto,

        cargo:
            "Treinamento",

        status:
            "Ativo"

    };

}

module.exports = {
    registrar
};