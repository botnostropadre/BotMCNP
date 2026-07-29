const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const caminhoBanco = path.join(__dirname, "membros.db");

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

        console.log("🗄 Banco conectado com sucesso.");

        iniciarBanco();

    }
);

// ======================================================
// EXECUTAR SQL
// ======================================================

function executar(sql, parametros = []) {

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
// CONSULTAR TODAS AS LINHAS
// ======================================================

function consultarTodos(sql, parametros = []) {

    return new Promise((resolve, reject) => {

        db.all(sql, parametros, (error, rows) => {

            if (error) {
                return reject(error);
            }

            resolve(rows);

        });

    });

}

// ======================================================
// ADICIONAR COLUNA CASO NÃO EXISTA
// ======================================================

async function garantirColuna(
    tabela,
    nomeColuna,
    definicao
) {

    const colunas = await consultarTodos(
        `PRAGMA table_info(${tabela})`
    );

    const existe = colunas.some(
        coluna => coluna.name === nomeColuna
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

        /*
         * Caso o banco já exista com a estrutura antiga,
         * estas verificações adicionam somente as colunas
         * que estiverem faltando.
         */

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

        console.log(
            "✅ Estrutura do banco verificada e atualizada."
        );

    } catch (error) {

        console.error(
            "❌ Erro ao preparar o banco de dados:",
            error
        );

    }

}

module.exports = db;