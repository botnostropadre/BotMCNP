const COLORS = require("../config/colors");

// ======================================================
// EDITORES ATIVOS
// ======================================================

const editores = new Map();

const TEMPO_EXPIRACAO = 30 * 60 * 1000;

// ======================================================
// CRIAR EDITOR
// ======================================================

function criarEditor(userId) {

    const agora = Date.now();

    const editor = {

        titulo: "",

        descricao: "",

        cor: COLORS.VERDE,

        rodape: "",

        faixa: "",

        canal: null,

        campos: [],

        criadoEm: agora,

        atualizadoEm: agora

    };

    editores.set(userId, editor);

    setTimeout(() => {

        const editorAtual = editores.get(userId);

        if (!editorAtual) return;

        const tempoSemAtualizacao =
            Date.now() - editorAtual.atualizadoEm;

        if (tempoSemAtualizacao >= TEMPO_EXPIRACAO) {

            editores.delete(userId);

        }

    }, TEMPO_EXPIRACAO);

    return editor;

}

// ======================================================
// OBTER EDITOR
// ======================================================

function obterEditor(userId) {

    return editores.get(userId) || null;

}

// ======================================================
// GARANTIR EDITOR ATIVO
// ======================================================

function garantirEditor(userId) {

    let editor = obterEditor(userId);

    if (!editor) {

        editor = criarEditor(userId);

    }

    return editor;

}

// ======================================================
// ATUALIZAR EDITOR
// ======================================================

function atualizarEditor(userId, dados = {}) {

    const editor = garantirEditor(userId);

    const editorAtualizado = {

        ...editor,

        ...dados,

        atualizadoEm: Date.now()

    };

    editores.set(userId, editorAtualizado);

    return editorAtualizado;

}

// ======================================================
// ADICIONAR CAMPO
// ======================================================

function adicionarCampo(userId, campo) {

    const editor = garantirEditor(userId);

    if (editor.campos.length >= 25) {

        throw new Error(
            "Um embed pode possuir no máximo 25 campos."
        );

    }

    const nome = campo.name?.trim();

    const valor = campo.value?.trim();

    if (!nome) {

        throw new Error(
            "Informe o título do campo."
        );

    }

    if (!valor) {

        throw new Error(
            "Informe o conteúdo do campo."
        );

    }

    editor.campos.push({

        name: nome,

        value: valor,

        inline: Boolean(campo.inline)

    });

    editor.atualizadoEm = Date.now();

    editores.set(userId, editor);

    return editor;

}

// ======================================================
// EDITAR CAMPO
// ======================================================

function editarCampo(userId, indice, campo) {

    const editor = obterEditor(userId);

    if (!editor) {

        throw new Error(
            "Nenhum editor ativo encontrado."
        );

    }

    if (!editor.campos[indice]) {

        throw new Error(
            "O campo informado não existe."
        );

    }

    const nome = campo.name?.trim();

    const valor = campo.value?.trim();

    if (!nome || !valor) {

        throw new Error(
            "O título e o conteúdo do campo são obrigatórios."
        );

    }

    editor.campos[indice] = {

        name: nome,

        value: valor,

        inline: Boolean(campo.inline)

    };

    editor.atualizadoEm = Date.now();

    editores.set(userId, editor);

    return editor;

}

// ======================================================
// REMOVER CAMPO
// ======================================================

function removerCampo(userId, indice) {

    const editor = obterEditor(userId);

    if (!editor) {

        throw new Error(
            "Nenhum editor ativo encontrado."
        );

    }

    if (!editor.campos[indice]) {

        throw new Error(
            "O campo informado não existe."
        );

    }

    editor.campos.splice(indice, 1);

    editor.atualizadoEm = Date.now();

    editores.set(userId, editor);

    return editor;

}

// ======================================================
// LIMPAR CAMPOS
// ======================================================

function limparCampos(userId) {

    const editor = obterEditor(userId);

    if (!editor) return null;

    editor.campos = [];

    editor.atualizadoEm = Date.now();

    editores.set(userId, editor);

    return editor;

}

// ======================================================
// RESETAR EDITOR
// ======================================================

function resetarEditor(userId) {

    return criarEditor(userId);

}

// ======================================================
// REMOVER EDITOR
// ======================================================

function removerEditor(userId) {

    return editores.delete(userId);

}

// ======================================================
// EXPORTAÇÕES
// ======================================================

module.exports = {

    criarEditor,

    obterEditor,

    garantirEditor,

    atualizarEditor,

    adicionarCampo,

    editarCampo,

    removerCampo,

    limparCampos,

    resetarEditor,

    removerEditor

};