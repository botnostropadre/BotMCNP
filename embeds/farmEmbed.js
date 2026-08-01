const {
    EmbedBuilder
} = require("discord.js");

const COLORS = require("../config/colors");

// ======================================================
// FORMATAR NÚMERO
// ======================================================

function formatarNumero(valor) {

    return Number(valor || 0)
        .toLocaleString("pt-BR");

}

// ======================================================
// CRIAR BARRA DE PROGRESSO
// ======================================================

function criarBarraProgresso(
    registrado,
    meta,
    tamanho = 10
) {

    if (!meta || meta <= 0) {

        return "░".repeat(tamanho);

    }

    const proporcao =
        Math.min(
            registrado / meta,
            1
        );

    const preenchidos =
        Math.round(
            proporcao * tamanho
        );

    const vazios =
        tamanho - preenchidos;

    return (
        "█".repeat(preenchidos) +
        "░".repeat(vazios)
    );

}

// ======================================================
// CALCULAR PORCENTAGEM
// ======================================================

function calcularPorcentagem(
    registrado,
    meta
) {

    if (!meta || meta <= 0) {

        return 0;

    }

    return Math.floor(
        (registrado / meta) * 100
    );

}

// ======================================================
// TEXTO DE PROGRESSO
// ======================================================

function criarTextoProgresso(
    registrado,
    meta,
    excedente,
    faltam
) {

    if (registrado >= meta) {

        return (
            `✅ **Meta concluída**\n` +
            `🎁 Você tem **${formatarNumero(excedente)} unidades a receber**.`
        );

    }

    return (
        `🟡 **Meta em andamento**\n` +
        `⏳ Faltam **${formatarNumero(faltam)} unidades** para atingir a meta.`
    );

}

// ======================================================
// STATUS GERAL
// ======================================================

function criarStatusGeral(
    tijolosConcluido,
    materiaisConcluido
) {

    if (
        tijolosConcluido &&
        materiaisConcluido
    ) {

        return "🟢 Todas as metas concluídas.";

    }

    if (
        tijolosConcluido &&
        !materiaisConcluido
    ) {

        return (
            "🟢 Meta de Tijolos concluída.\n" +
            "🟡 Meta de Materiais em andamento."
        );

    }

    if (
        !tijolosConcluido &&
        materiaisConcluido
    ) {

        return (
            "🟡 Meta de Tijolos em andamento.\n" +
            "🟢 Meta de Materiais concluída."
        );

    }

    return (
        "🟡 Meta de Tijolos em andamento.\n" +
        "🟡 Meta de Materiais em andamento."
    );

}

// ======================================================
// EMBED INDIVIDUAL DO FARM
// ======================================================

function criarFarmEmbed(
    nomeExibicao,
    resumo
) {

    const tijolosSemana =
        Number(
            resumo.tijolosSemana || 0
        );

    const materiaisDia =
        Number(
            resumo.materiaisDia || 0
        );

    const metaTijolos =
        Number(
            resumo.metaTijolosSemanal || 100
        );

    const metaMateriais =
        Number(
            resumo.metaMateriaisDiaria || 200
        );

    const porcentagemTijolos =
        calcularPorcentagem(
            tijolosSemana,
            metaTijolos
        );

    const porcentagemMateriais =
        calcularPorcentagem(
            materiaisDia,
            metaMateriais
        );

    const barraTijolos =
        criarBarraProgresso(
            tijolosSemana,
            metaTijolos
        );

    const barraMateriais =
        criarBarraProgresso(
            materiaisDia,
            metaMateriais
        );

    const tijolosConcluido =
        tijolosSemana >= metaTijolos;

    const materiaisConcluido =
        materiaisDia >= metaMateriais;

    const textoTijolos =
        criarTextoProgresso(
            tijolosSemana,
            metaTijolos,
            resumo.excedenteTijolos,
            resumo.faltamTijolos
        );

    const textoMateriais =
        criarTextoProgresso(
            materiaisDia,
            metaMateriais,
            resumo.excedenteMateriais,
            resumo.faltamMateriais
        );

    const statusGeral =
        criarStatusGeral(
            tijolosConcluido,
            materiaisConcluido
        );

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle("📦 Planilha de Farm")

        .setDescription(
`👤 **Integrante**
${nomeExibicao}

━━━━━━━━━━━━━━━━━━━━

🧱 **TIJOLOS**

\`${barraTijolos}\` **${porcentagemTijolos}%**

**Registrado na semana:**  
${formatarNumero(tijolosSemana)} unidades

**Meta semanal:**  
${formatarNumero(metaTijolos)} unidades

${textoTijolos}

━━━━━━━━━━━━━━━━━━━━

🔩 **MATERIAIS**

\`${barraMateriais}\` **${porcentagemMateriais}%**

**Registrado hoje:**  
${formatarNumero(materiaisDia)} unidades

**Meta diária:**  
${formatarNumero(metaMateriais)} unidades

${textoMateriais}

━━━━━━━━━━━━━━━━━━━━

📈 **Status das metas**

${statusGeral}`
        )

        .setFooter({
            text:
                `Última atualização: ${resumo.ultimaAtualizacao}`
        })

        .setTimestamp();

}

// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    criarFarmEmbed
};