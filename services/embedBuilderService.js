const COLORS = require("../config/colors");

const embeds = new Map();

const TEMPO_EXPIRACAO = 30 * 60 * 1000; // 30 minutos

function criarEditor(userId) {

    embeds.set(userId, {

        nome: "",

        titulo: "",

        descricao: "",

        cor: COLORS.VERDE,

        autor: {
            nome: "",
            icone: ""
        },

        rodape: {
            texto: "",
            icone: ""
        },

        thumbnail: "",

        imagem: "",

        canal: null,

        timestamp: false,

        campos: [],

        criadoEm: Date.now(),

        atualizadoEm: Date.now()

    });

    setTimeout(() => {

        const editor = embeds.get(userId);

        if (!editor) return;

        const expirado =
            Date.now() - editor.criadoEm >= TEMPO_EXPIRACAO;

        if (expirado) {

            embeds.delete(userId);

        }

    }, TEMPO_EXPIRACAO);

}

function obterEditor(userId) {

    return embeds.get(userId);

}

function atualizarEditor(userId, dados) {

    let editor = embeds.get(userId);

    if (!editor) {

        criarEditor(userId);

        editor = embeds.get(userId);

    }

    embeds.set(userId, {

        ...editor,

        ...dados,

        atualizadoEm: Date.now()

    });

}

function adicionarCampo(userId, campo) {

    const editor = embeds.get(userId);

    if (!editor) return;

    if (editor.campos.length >= 25) {

        throw new Error("Um embed pode possuir no máximo 25 campos.");

    }

    editor.campos.push({

        name: campo.name,

        value: campo.value,

        inline: campo.inline ?? false

    });

    editor.atualizadoEm = Date.now();

}

function editarCampo(userId, indice, campo) {

    const editor = embeds.get(userId);

    if (!editor) return;

    if (!editor.campos[indice]) return;

    editor.campos[indice] = {

        name: campo.name,

        value: campo.value,

        inline: campo.inline ?? false

    };

    editor.atualizadoEm = Date.now();

}

function removerCampo(userId, indice) {

    const editor = embeds.get(userId);

    if (!editor) return;

    if (!editor.campos[indice]) return;

    editor.campos.splice(indice, 1);

    editor.atualizadoEm = Date.now();

}

function limparCampos(userId) {

    const editor = embeds.get(userId);

    if (!editor) return;

    editor.campos = [];

    editor.atualizadoEm = Date.now();

}

function resetarEditor(userId) {

    criarEditor(userId);

}

function removerEditor(userId) {

    embeds.delete(userId);

}

module.exports = {

    criarEditor,

    obterEditor,

    atualizarEditor,

    adicionarCampo,

    editarCampo,

    removerCampo,

    limparCampos,

    resetarEditor,

    removerEditor

};