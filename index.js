require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection,
    ActivityType
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const settings = require("./config/settings.json");

const database =
    require("./database/database");

const {
    bancoPronto
} = database;

const {
    handleButton
} = require("./handlers/buttonHandler");

const {
    handleModal
} = require("./handlers/modalHandler");

const {
    handleSelectMenu
} = require("./handlers/selectMenuHandler");

const {
    handleAdvertenciaModal
} = require("./handlers/advertenciaModal");

const {
    handleGravidadeMenu
} = require("./handlers/gravidadeMenu");

const {
    handlePromoverMenu
} = require("./selectMenus/promoverMenu");

const {
    handleRebaixarMenu
} = require("./selectMenus/rebaixarMenu");
const {
    carregarAcoes
} = require("./services/carregarAcoes");

// ======================================================
// CRIAR CLIENTE
// ======================================================

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers

    ]

});

client.commands =
    new Collection();

// ======================================================
// CARREGAR COMANDOS
// ======================================================

const commandsPath =
    path.join(
        __dirname,
        "commands"
    );

const commandFiles =
    fs
        .readdirSync(commandsPath)
        .filter(
            file =>
                file.endsWith(".js")
        );

for (
    const file
    of commandFiles
) {

    console.log(
        `Carregando: ${file}`
    );

    try {

        const command =
            require(
                `./commands/${file}`
            );

        if (
            !command.data ||
            !command.execute
        ) {

            console.log(
                `❌ Comando inválido: ${file}`
            );

            continue;

        }

        client.commands.set(
            command.data.name,
            command
        );

    } catch (error) {

        console.error(
            `Erro ao carregar ${file}`
        );

        console.error(
            error
        );

    }

}

// ======================================================
// BOT PRONTO
// ======================================================

client.once(
    "clientReady",
    async () => {

        try {

            // ==========================================
            // AGUARDAR BANCO
            // ==========================================

            console.log(
                "⏳ Aguardando inicialização do banco..."
            );

            await bancoPronto;

            console.log(
                "✅ Banco inicializado."
            );

            // ==========================================
            // CARREGAR CATÁLOGO DE AÇÕES
            // ==========================================

            console.log(
                "⏳ Sincronizando catálogo de ações..."
            );

            const resultadoAcoes =
                await carregarAcoes();

            console.log(
                `🎯 Sincronização concluída: ` +
                `${resultadoAcoes.cadastradas} cadastrada(s), ` +
                `${resultadoAcoes.erros} erro(s).`
            );

            // ==========================================
            // CONFERIR QUANTAS AÇÕES ESTÃO NO SQLITE
            // ==========================================

            const totalAcoes =
                await new Promise(
                    (resolve, reject) => {

                        database.get(
                            `
                                SELECT COUNT(*) AS total
                                FROM acoes
                            `,
                            [],
                            (
                                error,
                                row
                            ) => {

                                if (error) {

                                    return reject(
                                        error
                                    );

                                }

                                resolve(
                                    row?.total || 0
                                );

                            }
                        );

                    }
                );

            console.log(
                `📊 Ações existentes no banco: ${totalAcoes}`
            );

        } catch (error) {

            console.error(
                "❌ Erro ao preparar banco/catálogo de ações:"
            );

            console.error(
                error
            );

        }

        // ==========================================
        // BOT ONLINE
        // ==========================================

        console.log(
            "======================================"
        );

        console.log(
            `💵 ${settings.mc.nome.toUpperCase()}`
        );

        console.log(
            "======================================"
        );

        console.log(
            `🤖 ${client.user.tag}`
        );

        console.log(
            "Sistema iniciado com sucesso."
        );

        console.log(
            "======================================"
        );

        client.user.setPresence({

            activities: [

                {

                    name:
                        settings.mc.nome,

                    type:
                        ActivityType.Watching

                }

            ],

            status:
                "online"

        });

    }
);

// ======================================================
// INTERAÇÕES
// ======================================================

client.on(
    "interactionCreate",
    async interaction => {

        console.log(
    "======================================"
);

console.log(
    "[DISCORD] INTERAÇÃO RECEBIDA"
);

console.log(
    "[DISCORD] Tipo:",
    interaction.type
);

console.log(
    "[DISCORD] Comando:",
    interaction.commandName || "N/A"
);

console.log(
    "[DISCORD] Usuário:",
    interaction.user?.tag || interaction.user?.id
);

console.log(
    "======================================"
);

        const idadeInteracao =
            Date.now() -
            interaction.createdTimestamp;

        const identificador =
            interaction.customId ||
            interaction.commandName ||
            "sem-id";

        console.log(
            `[INTERAÇÃO] Tipo: ${interaction.type} | ` +
            `ID: ${identificador} | ` +
            `Atraso: ${idadeInteracao}ms`
        );

        try {

            // ==========================================
            // COMANDOS
            // ==========================================

            if (
                interaction.isChatInputCommand()
            ) {

                const command =
                    client.commands.get(
                        interaction.commandName
                    );

                if (!command) {

                    console.log(
                        `Comando não encontrado: ${interaction.commandName}`
                    );

                    return;

                }

                await command.execute(
                    interaction
                );

                return;

            }

            // ==========================================
            // BOTÕES
            // ==========================================

            if (
                interaction.isButton()
            ) {

                await handleButton(
                    interaction
                );

                return;

            }

            // ==========================================
            // MENU DE CANAIS
            // ==========================================

            if (
                interaction.isChannelSelectMenu()
            ) {

                await handleSelectMenu(
                    interaction
                );

                return;

            }

            // ==========================================
            // MENUS DE TEXTO
            // ==========================================

            if (
                interaction.isStringSelectMenu()
            ) {

                await handleSelectMenu(
                    interaction
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    return;

                }

                await handleGravidadeMenu(
                    interaction
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    return;

                }

                await handlePromoverMenu(
                    interaction
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    return;

                }

                await handleRebaixarMenu(
                    interaction
                );

                return;

            }

            // ==========================================
            // MODAIS
            // ==========================================

            if (
                interaction.isModalSubmit()
            ) {

                await handleModal(
                    interaction
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    return;

                }

                await handleAdvertenciaModal(
                    interaction
                );

                return;

            }

        } catch (error) {

            console.error(
                "Erro ao processar interação:"
            );

            console.error(
                error
            );

            console.error(
                `A interação tinha ${
                    Date.now() -
                    interaction.createdTimestamp
                }ms quando ocorreu o erro.`
            );

            if (
                error.code === 10062 ||
                error.code === 40060
            ) {

                console.error(
                    "❌ Interação expirada ou já respondida por outra instância."
                );

                return;

            }

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({

                    content:
                        "❌ Ocorreu um erro ao executar esta ação.",

                    flags:
                        64

                }).catch(
                    replyError => {

                        console.error(
                            "Não foi possível enviar a mensagem de erro:",
                            replyError.message
                        );

                    }
                );

            }

        }

    }
);

// ======================================================
// VERIFICAR TOKEN
// ======================================================

if (!process.env.TOKEN) {

    console.error(
        "❌ TOKEN não encontrado no arquivo .env."
    );

    process.exit(1);

}

// ======================================================
// CONECTAR BOT
// ======================================================

console.log(
    "[BOT] Tentando conectar ao Discord..."
);

client.login(
    process.env.TOKEN
)
.then(() => {

    console.log(
        "[BOT] Login aceito pelo Discord."
    );

})
.catch(error => {

    console.error(
        "[BOT] ERRO AO FAZER LOGIN:"
    );

    console.error(
        error
    );

    process.exit(1);

});