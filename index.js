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

    await bancoPronto;
    await carregarAcoes();

} catch (error) {

    console.error(
        "❌ Erro ao carregar catálogo de ações:",
        error
    );

}

        console.clear();

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

client.login(
    process.env.TOKEN
);