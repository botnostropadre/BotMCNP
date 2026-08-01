const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// ======================================================
// CAMINHO DO BANCO
// ======================================================
// No Railway utiliza o Volume Persistente.
// No computador utiliza a pasta database.

const pastaBanco =
    process.env.RAILWAY_VOLUME_MOUNT_PATH ||
    __dirname;

if (!fs.existsSync(pastaBanco)) {

    fs.mkdirSync(
        pastaBanco,
        {
            recursive: true
        }
    );

}

const caminhoBanco = path.join(
    pastaBanco,
    "membros.db"
);

console.log(
    `📁 Banco localizado em: ${caminhoBanco}`
);

// ======================================================
// CONEXÃO
// ======================================================

const db = new sqlite3.Database(
    caminhoBanco,
    error => {

        if (error) {

            console.error(
                "❌ Erro ao conectar ao banco:",
                error.message
            );

            return;

        }

        console.log(
            "🗄 Banco conectado com sucesso."
        );

        iniciarBanco();

    }
);

// ======================================================
// EXECUTAR SQL
// ======================================================

function executar(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.run(
                sql,
                parametros,
                function (error) {

                    if (error) {

                        return reject(error);

                    }

                    resolve(this);

                }
            );

        }
    );

}

// ======================================================
// CONSULTAR TODAS AS LINHAS
// ======================================================

function consultarTodos(
    sql,
    parametros = []
) {

    return new Promise(
        (resolve, reject) => {

            db.all(
                sql,
                parametros,
                (error, rows) => {

                    if (error) {

                        return reject(error);

                    }

                    resolve(rows);

                }
            );

        }
    );

}

// ======================================================
// ADICIONAR COLUNA CASO NÃO EXISTA
// ======================================================

async function garantirColuna(
    tabela,
    nomeColuna,
    definicao
) {

    const colunas =
        await consultarTodos(
            `PRAGMA table_info(${tabela})`
        );

    const existe =
        colunas.some(
            coluna =>
                coluna.name === nomeColuna
        );

    if (existe) return;

    await executar(
        `ALTER TABLE ${tabela}
         ADD COLUMN ${nomeColuna} ${definicao}`
    );

    console.log(
        `✅ Coluna adicionada: ${tabela}.${nomeColuna}`
    );

}

// ======================================================
// INICIAR E MIGRAR BANCO
// ======================================================

async function iniciarBanco() {

    try {

        // ==================================================
        // MEMBROS
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS membros (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                discordId TEXT UNIQUE,

                nome TEXT,
                vulgo TEXT,
                sobrenome TEXT,
                nomeCompleto TEXT,

                secretario TEXT,

                cargo TEXT,

                advertencias INTEGER DEFAULT 0,
                promocoes INTEGER DEFAULT 0,
                rebaixamentos INTEGER DEFAULT 0,

                status TEXT DEFAULT 'Ativo',

                dataRegistro TEXT,
                ultimaPromocao TEXT,
                ultimaAdvertencia TEXT

            )
        `);

        await garantirColuna(
            "membros",
            "nome",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "vulgo",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "sobrenome",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "nomeCompleto",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "secretario",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "cargo",
            "TEXT DEFAULT 'Prospect'"
        );

        await garantirColuna(
            "membros",
            "advertencias",
            "INTEGER DEFAULT 0"
        );

        await garantirColuna(
            "membros",
            "promocoes",
            "INTEGER DEFAULT 0"
        );

        await garantirColuna(
            "membros",
            "rebaixamentos",
            "INTEGER DEFAULT 0"
        );

        await garantirColuna(
            "membros",
            "status",
            "TEXT DEFAULT 'Ativo'"
        );

        await garantirColuna(
            "membros",
            "dataRegistro",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "ultimaPromocao",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "ultimaAdvertencia",
            "TEXT"
        );

        // ==================================================
        // ADVERTÊNCIAS
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS advertencias (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                discordId TEXT,

                motivo TEXT,

                gravidade TEXT,

                responsavel TEXT,

                data TEXT

            )
        `);

        // ==================================================
        // FINANCEIRO
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS financeiro (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                tipo TEXT,

                categoria TEXT,

                valor REAL,

                descricao TEXT,

                autor TEXT,

                data TEXT

            )
        `);

        // ==================================================
        // HISTÓRICO FINANCEIRO
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS historicoFinanceiro (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                tipo TEXT,

                categoria TEXT,

                valor REAL,

                descricao TEXT,

                responsavel TEXT,

                data TEXT

            )
        `);

        // ==================================================
        // PAINÉIS
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS paineis (

                nome TEXT PRIMARY KEY,

                canalId TEXT,

                mensagemId TEXT

            )
        `);

        // ==================================================
        // EMBEDS
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS embeds (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                nome TEXT,

                canalId TEXT,

                mensagemId TEXT,

                titulo TEXT,

                descricao TEXT,

                cor TEXT,

                thumbnail TEXT,

                imagem TEXT,

                footer TEXT,

                footerIcon TEXT,

                autor TEXT,

                autorIcon TEXT,

                criadoPor TEXT,

                dataCriacao TEXT

            )
        `);

        // ==================================================
        // FARM — CANAL E EMBED INDIVIDUAL
        // ==================================================
        /*
         * Guarda o canal individual de cada integrante
         * e a mensagem fixa que será sempre atualizada.
         */

        await executar(`
            CREATE TABLE IF NOT EXISTS farmMembros (

                discordId TEXT PRIMARY KEY,

                nomeExibicao TEXT,

                canalId TEXT UNIQUE,

                mensagemId TEXT,

                ultimaAtualizacao TEXT

            )
        `);

        await garantirColuna(
            "farmMembros",
            "nomeExibicao",
            "TEXT"
        );

        await garantirColuna(
            "farmMembros",
            "canalId",
            "TEXT"
        );

        await garantirColuna(
            "farmMembros",
            "mensagemId",
            "TEXT"
        );

        await garantirColuna(
            "farmMembros",
            "ultimaAtualizacao",
            "TEXT"
        );

        // ==================================================
        // FARM — HISTÓRICO DE LANÇAMENTOS
        // ==================================================
        /*
         * Cada envio do formulário gera uma linha.
         *
         * dataDia:
         * permite calcular a meta diária de Materiais.
         *
         * semanaInicio:
         * permite calcular a meta semanal de Tijolos
         * e gerar o ranking da semana.
         */

        await executar(`
            CREATE TABLE IF NOT EXISTS farmRegistros (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                discordId TEXT NOT NULL,

                tijolos INTEGER DEFAULT 0,

                materiais INTEGER DEFAULT 0,

                dataRegistro TEXT NOT NULL,

                dataDia TEXT NOT NULL,

                semanaInicio TEXT NOT NULL

            )
        `);

        await garantirColuna(
            "farmRegistros",
            "discordId",
            "TEXT"
        );

        await garantirColuna(
            "farmRegistros",
            "tijolos",
            "INTEGER DEFAULT 0"
        );

        await garantirColuna(
            "farmRegistros",
            "materiais",
            "INTEGER DEFAULT 0"
        );

        await garantirColuna(
            "farmRegistros",
            "dataRegistro",
            "TEXT"
        );

        await garantirColuna(
            "farmRegistros",
            "dataDia",
            "TEXT"
        );

        await garantirColuna(
            "farmRegistros",
            "semanaInicio",
            "TEXT"
        );

        // ==================================================
        // ÍNDICES DO FARM
        // ==================================================
        /*
         * Melhoram a velocidade do relatório,
         * do ranking e das consultas individuais.
         */

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_farm_registros_discord
            ON farmRegistros (discordId)
        `);

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_farm_registros_dia
            ON farmRegistros (dataDia)
        `);

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_farm_registros_semana
            ON farmRegistros (semanaInicio)
        `);

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_farm_registros_membro_semana
            ON farmRegistros (
                discordId,
                semanaInicio
            )
        `);

        console.log(
            "✅ Estrutura do banco verificada e atualizada."
        );

        console.log(
            "✅ Estrutura do sistema de farm preparada."
        );

    } catch (error) {

        console.error(
            "❌ Erro ao preparar o banco:",
            error
        );

    }

}

module.exports = db;