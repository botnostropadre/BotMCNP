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
// REGISTRAR MEMBRO
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
    // BUSCAR MEMBRO
    // ==================================================

    let membro;

    try {

        membro = await interaction.guild.members.fetch(
            interaction.user.id
        );

    } catch (error) {

        console.error(
            "Erro ao buscar membro durante o registro:",
            error
        );

        throw new Error(
            "Não foi possível localizar seu usuário no servidor."
        );

    }

    // ==================================================
    // VALIDAR CARGO PROSPECT
    // ==================================================

    const cargoProspectId = settings.cargos?.prospect;

    if (!cargoProspectId) {

        throw new Error(
            "O ID do cargo Prospect não está configurado no settings.json."
        );

    }

    const cargoProspect = await interaction.guild.roles
        .fetch(cargoProspectId)
        .catch(() => null);

    if (!cargoProspect) {

        throw new Error(
            "O cargo Prospect não foi encontrado no servidor. Verifique o ID no settings.json."
        );

    }

    // ==================================================
    // VALIDAR POSIÇÃO DO BOT
    // ==================================================

    const membroBot = interaction.guild.members.me;

    if (!membroBot) {

        throw new Error(
            "Não foi possível identificar o cargo do bot."
        );

    }

    if (
        membroBot.roles.highest.position <=
        cargoProspect.position
    ) {

        throw new Error(
            "O cargo do bot precisa estar acima do cargo Prospect na lista de cargos do servidor."
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
            "Você já possui um registro no sistema do motoclube."
        );

    }

    // ==================================================
    // ALTERAR NICKNAME
    // ==================================================

    const nicknameAnterior = membro.nickname;

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

        if (interaction.guild.ownerId === membro.id) {

            throw new Error(
                "O Discord não permite que o bot altere o apelido do dono do servidor."
            );

        }

        throw new Error(
            "Não foi possível alterar seu apelido. Coloque o cargo do bot acima do seu cargo e permita a opção Gerenciar Apelidos."
        );

    }

    // ==================================================
    // ADICIONAR CARGO PROSPECT
    // ==================================================

    try {

        await membro.roles.add(
            cargoProspect,
            `Registro realizado por ${interaction.user.tag}`
        );

    } catch (error) {

        console.error(
            "Erro ao adicionar cargo Prospect:",
            error
        );

        try {
            await membro.setNickname(nicknameAnterior);
        } catch {}

        throw new Error(
            "Não foi possível adicionar o cargo Prospect. Verifique a posição do cargo do bot e a permissão Gerenciar Cargos."
        );

    }

    // ==================================================
    // SALVAR NO BANCO
    // ==================================================

    const dataRegistro = new Date().toLocaleString("pt-BR");

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
                "Prospect",
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
            await membro.roles.remove(cargoProspect);
        } catch {}

        try {
            await membro.setNickname(nicknameAnterior);
        } catch {}

        throw new Error(
            `Não foi possível salvar o registro no banco de dados: ${error.message}`
        );

    }

    // ==================================================
    // ENVIAR LOG
    // ==================================================

    const canalLogsId = settings.canais?.logs;

    if (canalLogsId) {

        try {

            const canalLogs = await interaction.guild.channels
                .fetch(canalLogsId);

            if (canalLogs?.isTextBased()) {

                await canalLogs.send({
                    embeds: [
                        {
                            color: COLORS.VERDE,

                            title: "📋 Novo Registro",

                            thumbnail: {
                                url: interaction.user.displayAvatarURL({
                                    size: 256
                                })
                            },

                            fields: [
                                {
                                    name: "👤 Integrante",
                                    value: nomeCompleto,
                                    inline: false
                                },
                                {
                                    name: "📝 Secretário responsável",
                                    value: secretario,
                                    inline: true
                                },
                                {
                                    name: "🎖 Cargo",
                                    value: "Prospect",
                                    inline: true
                                },
                                {
                                    name: "📌 Status",
                                    value: "Ativo",
                                    inline: true
                                },
                                {
                                    name: "💬 Discord",
                                    value: `${interaction.user}`,
                                    inline: false
                                }
                            ],

                            footer: {
                                text: `${
                                    settings.mc?.nome ||
                                    "Padre Nosso MC"
                                } • Sistema de Registro`
                            },

                            timestamp: new Date().toISOString()
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
        cargo: "Prospect",
        status: "Ativo"
    };

}

module.exports = {
    registrar
};