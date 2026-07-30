require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Collection,
    ActivityType
} = require("discord.js");

const fs = require("fs");
const path = require("path");

require("./database/database");

const {
    handleButton
} = require("./handlers/buttonHandler");

const {
    handleModal
} = require("./handlers/modalHandler");

const {
    handleDashboard
} = require("./handlers/dashboardHandler");

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
    setClient
} = require("./services/dashboardService");

// ======================================================
// CRIAR CLIENTE
// ======================================================

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers

    ]

});

client.commands = new Collection();

// ======================================================
// CARREGAR COMANDOS
// ======================================================

const commandsPath = path.join(
    __dirname,
    "commands"
);

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    console.log(
        `Carregando: ${file}`
    );

    try {

        const command = require(
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

        console.error(error);

    }

}

// ======================================================
// BOT PRONTO
// ======================================================

client.once("ready", () => {

    setClient(client);

    console.clear();

    console.log(
        "======================================"
    );

    console.log(
        "🏍 PADRE NOSSO MC"
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

                name: "Padre Nosso MC",

                type: ActivityType.Watching

            }

        ],

        status: "online"

    });

});

// ======================================================
// INTERAÇÕES
// ======================================================

client.on(
    "interactionCreate",
    async interaction => {

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

                /*
                 * O dashboard também utiliza botões.
                 * Cada handler verifica seu próprio customId.
                 */
                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {

                    await handleDashboard(
                        interaction
                    );

                }

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
                    !interaction.replied &&
                    !interaction.deferred
                ) {

                    await handleGravidadeMenu(
                        interaction
                    );

                }

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {

                    await handlePromoverMenu(
                        interaction
                    );

                }

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {

                    await handleRebaixarMenu(
                        interaction
                    );

                }

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
                    !interaction.replied &&
                    !interaction.deferred
                ) {

                    await handleAdvertenciaModal(
                        interaction
                    );

                }

                return;

            }

        } catch (error) {

            console.error(
                "Erro ao processar interação:"
            );

            console.error(error);

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({

                    content:
                        "❌ Ocorreu um erro ao executar esta ação.",

                    flags: 64

                }).catch(() => {});

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