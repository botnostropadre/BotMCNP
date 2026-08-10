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

                idCidade TEXT,

                recrutador TEXT,

                areaDesejada TEXT,

                fazLive INTEGER DEFAULT 0,

                linkLive TEXT,

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

        // ==================================================
        // GARANTIR COLUNAS — MEMBROS
        // ==================================================

        await garantirColuna(
            "membros",
            "nome",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "idCidade",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "recrutador",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "areaDesejada",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "fazLive",
            "INTEGER DEFAULT 0"
        );

        await garantirColuna(
            "membros",
            "linkLive",
            "TEXT"
        );

        await garantirColuna(
            "membros",
            "cargo",
            "TEXT"
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
        // REGISTROS PENDENTES
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS registrosPendentes (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                discordId TEXT NOT NULL,

                nome TEXT NOT NULL,

                idCidade TEXT NOT NULL,

                recrutador TEXT NOT NULL,

                areaDesejada TEXT NOT NULL,

                fazLive INTEGER DEFAULT 0,

                linkLive TEXT,

                status TEXT NOT NULL DEFAULT 'Pendente',

                cargoSelecionadoId TEXT,

                cargoSelecionadoNome TEXT,

                aprovadoPorId TEXT,

                aprovadoPorNome TEXT,

                resultadoEm TEXT,

                criadoEm TEXT NOT NULL,

                canalAprovacaoId TEXT,

                mensagemAprovacaoId TEXT

            )
        `);

        // ==================================================
        // GARANTIR COLUNAS — REGISTROS PENDENTES
        // ==================================================

        await garantirColuna(
            "registrosPendentes",
            "discordId",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "nome",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "idCidade",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "recrutador",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "areaDesejada",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "fazLive",
            "INTEGER DEFAULT 0"
        );

        await garantirColuna(
            "registrosPendentes",
            "linkLive",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "status",
            "TEXT DEFAULT 'Pendente'"
        );

        await garantirColuna(
            "registrosPendentes",
            "cargoSelecionadoId",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "cargoSelecionadoNome",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "aprovadoPorId",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "aprovadoPorNome",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "resultadoEm",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "criadoEm",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "canalAprovacaoId",
            "TEXT"
        );

        await garantirColuna(
            "registrosPendentes",
            "mensagemAprovacaoId",
            "TEXT"
        );

        // ==================================================
        // ÍNDICES DOS REGISTROS PENDENTES
        // ==================================================

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_registros_pendentes_discord
            ON registrosPendentes (discordId)
        `);

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_registros_pendentes_status
            ON registrosPendentes (status)
        `);

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_registros_pendentes_mensagem
            ON registrosPendentes (mensagemAprovacaoId)
        `);

        
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
// ==================================================
// EVENTOS
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS eventos (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        mensagemId TEXT UNIQUE,

        nome TEXT,

        descricao TEXT,

        dataHora TEXT,

        traje TEXT,

        responsavel TEXT,

        quantidadeAuxiliares INTEGER,

        flyer TEXT,

        criadoPor TEXT,

        dataCriacao TEXT

    )
`);

// ==================================================
// PARTICIPANTES DOS EVENTOS
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS eventoParticipantes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        mensagemId TEXT,

        discordId TEXT,

        nome TEXT,

        ordem INTEGER
    )
`);

await garantirColuna(
    "eventos",
    "mensagemId",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "nome",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "descricao",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "dataHora",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "traje",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "responsavel",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "quantidadeAuxiliares",
    "INTEGER DEFAULT 0"
);

await garantirColuna(
    "eventos",
    "flyer",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "criadoPor",
    "TEXT"
);

await garantirColuna(
    "eventos",
    "dataCriacao",
    "TEXT"
);

await garantirColuna(
    "eventoParticipantes",
    "mensagemId",
    "TEXT"
);

await garantirColuna(
    "eventoParticipantes",
    "discordId",
    "TEXT"
);

await garantirColuna(
    "eventoParticipantes",
    "nome",
    "TEXT"
);

await garantirColuna(
    "eventoParticipantes",
    "ordem",
    "INTEGER"
);

        // ==================================================
        // ÍNDICES DOS EVENTOS
        // ==================================================

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_eventos_mensagem
            ON eventos (mensagemId)
        `);

        await executar(`
            CREATE INDEX IF NOT EXISTS
            idx_evento_participantes
            ON eventoParticipantes (
                mensagemId,
                discordId
            )
        `);

        // ==================================================
        // PARCEIROS
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS parceiros (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                nomeFaccao TEXT NOT NULL,

                categoria TEXT NOT NULL,

                responsavel1 TEXT NOT NULL,

                telefone1 TEXT NOT NULL,

                responsavel2 TEXT,

                telefone2 TEXT,

                responsavel3 TEXT,

                telefone3 TEXT,

                criadoPor TEXT,

                dataCriacao TEXT

            )
        `);

        // ==================================================
        // PRODUTOS DOS PARCEIROS
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS parceiroProdutos (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                parceiroId INTEGER NOT NULL,

                produto TEXT NOT NULL,

                valor TEXT NOT NULL,

                ordem INTEGER DEFAULT 1,

                FOREIGN KEY (
                    parceiroId
                )
                REFERENCES parceiros(id)
                ON DELETE CASCADE

            )
        `);

        // ==================================================
        // PAINEL DOS PARCEIROS
        // ==================================================

        await executar(`
            CREATE TABLE IF NOT EXISTS painelParceiros (

                id INTEGER PRIMARY KEY CHECK (id = 1),

                canalId TEXT,

                mensagemId TEXT,

                ultimaAtualizacao TEXT

            )
        `);

        // ==================================================
        // GARANTIR COLUNAS — PARCEIROS
        // ==================================================

        await garantirColuna(
            "parceiros",
            "nomeFaccao",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "categoria",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "responsavel1",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "telefone1",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "responsavel2",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "telefone2",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "responsavel3",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "telefone3",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "criadoPor",
            "TEXT"
        );

        await garantirColuna(
            "parceiros",
            "dataCriacao",
            "TEXT"
        );

        // ==================================================
        // GARANTIR COLUNAS — PRODUTOS
        // ==================================================

        await garantirColuna(
            "parceiroProdutos",
            "parceiroId",
            "INTEGER"
        );

        await garantirColuna(
            "parceiroProdutos",
            "produto",
            "TEXT"
        );

        await garantirColuna(
            "parceiroProdutos",
            "valor",
            "TEXT"
        );

        await garantirColuna(
            "parceiroProdutos",
            "ordem",
            "INTEGER DEFAULT 1"
        );

        // ==================================================
        // GARANTIR COLUNAS — PAINEL
        // ==================================================

        await garantirColuna(
            "painelParceiros",
            "canalId",
            "TEXT"
        );

        await garantirColuna(
            "painelParceiros",
            "mensagemId",
            "TEXT"
        );

        await garantirColuna(
            "painelParceiros",
            "ultimaAtualizacao",
            "TEXT"
        );

                // ==================================================
// ÍNDICES DOS PARCEIROS
// ==================================================

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_parceiros_categoria
    ON parceiros (categoria)
`);

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_parceiro_produtos_parceiro
    ON parceiroProdutos (parceiroId)
`);

// ==================================================
// AÇÕES
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS acoes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        chave TEXT UNIQUE,

        nome TEXT NOT NULL,

        porte TEXT NOT NULL,

        contingente INTEGER NOT NULL,

        reservas INTEGER DEFAULT 2,

        armamento TEXT,

        resumoRegras TEXT,

        imagemPerimetro TEXT,

        ativo INTEGER DEFAULT 1

    )
`);

// ==================================================
// AÇÕES MARCADAS
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS acoesMarcadas (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        acaoId INTEGER NOT NULL,

        mensagemId TEXT UNIQUE,

        canalId TEXT,

        status TEXT DEFAULT 'Aberta',

        criadoPorId TEXT,

        criadoPorNome TEXT,

        criadoEm TEXT,

        finalizadoPorId TEXT,

        finalizadoPorNome TEXT,

        finalizadoEm TEXT

    )
`);

// ==================================================
// PARTICIPANTES DAS AÇÕES
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS acoesParticipantes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        acaoMarcadaId INTEGER NOT NULL,

        discordId TEXT NOT NULL,

        nome TEXT NOT NULL,

        ordem INTEGER NOT NULL,

        tipo TEXT NOT NULL,

        participou INTEGER DEFAULT 1,

        UNIQUE (
            acaoMarcadaId,
            discordId
        )

    )
`);

// ==================================================
// RESULTADOS DAS AÇÕES
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS acoesResultados (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        acaoMarcadaId INTEGER UNIQUE NOT NULL,

        resultado TEXT NOT NULL,

        valorRendido REAL DEFAULT 0,

        observacoes TEXT,

        registradoPorId TEXT,

        registradoPorNome TEXT,

        registradoEm TEXT

    )
`);

// ==================================================
// KILLS DAS AÇÕES
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS acoesKills (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        acaoMarcadaId INTEGER NOT NULL,

        discordId TEXT NOT NULL,

        nome TEXT NOT NULL,

        kills INTEGER DEFAULT 0,

        UNIQUE (
            acaoMarcadaId,
            discordId
        )

    )
`);

// ==================================================
// PAINEL DE AÇÕES
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS painelAcoes (

        id INTEGER PRIMARY KEY CHECK (id = 1),

        canalId TEXT,

        mensagemId TEXT,

        ultimaAtualizacao TEXT

    )
`);

// ==================================================
// PAINEL — RESUMO DOS PVPS
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS painelResumoPvp (

        id INTEGER PRIMARY KEY CHECK (id = 1),

        canalId TEXT,

        mensagemId TEXT,

        ultimaAtualizacao TEXT

    )
`);

// ==================================================
// PAINEL — ESTATÍSTICAS GERAIS
// ==================================================

await executar(`
    CREATE TABLE IF NOT EXISTS painelEstatisticasGerais (

        id INTEGER PRIMARY KEY CHECK (id = 1),

        canalId TEXT,

        mensagemId TEXT,

        ultimaAtualizacao TEXT

    )
`);

// ==================================================
// ÍNDICES DAS AÇÕES
// ==================================================

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_acoes_porte
    ON acoes (porte)
`);

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_acoes_ativo
    ON acoes (ativo)
`);

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_acoes_marcadas_status
    ON acoesMarcadas (status)
`);

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_acoes_participantes_acao
    ON acoesParticipantes (acaoMarcadaId)
`);

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_acoes_participantes_usuario
    ON acoesParticipantes (discordId)
`);

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_acoes_kills_acao
    ON acoesKills (acaoMarcadaId)
`);

await executar(`
    CREATE INDEX IF NOT EXISTS
    idx_acoes_kills_usuario
    ON acoesKills (discordId)
`);

// ==================================================
// LOGS DE INICIALIZAÇÃO
// ==================================================

console.log(
    "✅ Estrutura do banco verificada e atualizada."
);

console.log(
    "✅ Estrutura do sistema de farm preparada."
);

console.log(
    "✅ Estrutura do sistema de eventos preparada."
);

console.log(
    "✅ Estrutura do sistema de parceiros preparada."
);

console.log(
    "✅ Estrutura do sistema de ações e PVP preparada."
);

} catch (error) {

    console.error(
        "❌ Erro ao preparar o banco:",
        error
    );

}

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = db;