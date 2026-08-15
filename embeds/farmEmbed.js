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
    faltam,
    tipo = "unidades"
) {

    const formatarValor =
        valor => {

            if (
                tipo ===
                "dinheiro"
            ) {

                return Number(
                    valor || 0
                ).toLocaleString(
                    "pt-BR",
                    {
                        style:
                            "currency",

                        currency:
                            "BRL",

                        maximumFractionDigits:
                            0
                    }
                );

            }

            return (
                `${formatarNumero(valor)} unidades`
            );

        };

    if (
        registrado >=
        meta
    ) {

        return (
            `✅ **Meta concluída**\n` +
            `🎁 Excedente: **${formatarValor(excedente)}**.`
        );

    }

    return (
        `🟡 **Meta em andamento**\n` +
        `⏳ Faltam **${formatarValor(faltam)}** para atingir a meta.`
    );

}

// ======================================================
// STATUS GERAL
// ======================================================

function criarStatusGeral(
    dadosConcluido,
    dinheiroSujoConcluido
) {

    if (
        dadosConcluido &&
        dinheiroSujoConcluido
    ) {

        return "🟢 Todas as metas concluídas.";

    }

    if (
        dadosConcluido &&
        !dinheiroSujoConcluido
    ) {

        return (
            "🟢 Meta de Dados concluída.\n" +
            "🟡 Meta de Dinheiro Sujo em andamento."
        );

    }

    if (
        !dadosConcluido &&
        dinheiroSujoConcluido
    ) {

        return (
            "🟡 Meta de Dados em andamento.\n" +
            "🟢 Meta de Dinheiro Sujo concluída."
        );

    }

    return (
        "🟡 Meta de Dados em andamento.\n" +
        "🟡 Meta de Dinheiro Sujo em andamento."
    );

}

// ======================================================
// EMBED INDIVIDUAL DO FARM
// ======================================================

function criarFarmEmbed(
    nomeExibicao,
    resumo
) {

    const dadosDia =
        Number(
            resumo.dadosDia || 0
        );

    const dadosSemana =
        Number(
            resumo.dadosSemana || 0
        );

    const dinheiroSujoSemana =
        Number(
            resumo.dinheiroSujoSemana || 0
        );

    const metaDadosDiaria =
        Number(
            resumo.metaDadosDiaria || 350
        );

    const metaDadosSemanal =
        Number(
            resumo.metaDadosSemanal || 1750
        );

    const metaDinheiroSujoSemanal =
        Number(
            resumo.metaDinheiroSujoSemanal || 500000
        );

    const porcentagemDadosDia =
        calcularPorcentagem(
            dadosDia,
            metaDadosDiaria
        );

    const porcentagemDadosSemana =
        calcularPorcentagem(
            dadosSemana,
            metaDadosSemanal
        );

    const porcentagemDinheiroSujo =
        calcularPorcentagem(
            dinheiroSujoSemana,
            metaDinheiroSujoSemanal
        );

    const barraDadosDia =
        criarBarraProgresso(
            dadosDia,
            metaDadosDiaria
        );

    const barraDadosSemana =
        criarBarraProgresso(
            dadosSemana,
            metaDadosSemanal
        );

    const barraDinheiroSujo =
        criarBarraProgresso(
            dinheiroSujoSemana,
            metaDinheiroSujoSemanal
        );

    const dadosConcluido =
        dadosSemana >=
        metaDadosSemanal;

    const dinheiroSujoConcluido =
        dinheiroSujoSemana >=
        metaDinheiroSujoSemanal;

    const textoDadosDia =
        criarTextoProgresso(
            dadosDia,
            metaDadosDiaria,
            resumo.excedenteDadosDia,
            resumo.faltamDadosDia
        );

    const textoDadosSemana =
        criarTextoProgresso(
            dadosSemana,
            metaDadosSemanal,
            resumo.excedenteDadosSemana,
            resumo.faltamDadosSemana
        );

    const textoDinheiroSujo =
        criarTextoProgresso(
            dinheiroSujoSemana,
            metaDinheiroSujoSemanal,
            resumo.excedenteDinheiroSujoSemana,
            resumo.faltamDinheiroSujoSemana,
            "dinheiro"
        );

    const statusGeral =
        criarStatusGeral(
            dadosConcluido,
            dinheiroSujoConcluido
        );

    const dinheiroSujoFormatado =
        dinheiroSujoSemana
            .toLocaleString(
                "pt-BR",
                {
                    style:
                        "currency",

                    currency:
                        "BRL",

                    maximumFractionDigits:
                        0
                }
            );

    const metaDinheiroSujoFormatada =
        metaDinheiroSujoSemanal
            .toLocaleString(
                "pt-BR",
                {
                    style:
                        "currency",

                    currency:
                        "BRL",

                    maximumFractionDigits:
                        0
                }
            );

    return new EmbedBuilder()

        .setColor(
            COLORS.VERDE
        )

        .setTitle(
            "📦 Planilha de Farm"
        )

        .setDescription(
`👤 **Integrante**
${nomeExibicao}

━━━━━━━━━━━━━━━━━━━━

💳 **DADOS — HOJE**

\`${barraDadosDia}\` **${porcentagemDadosDia}%**

**Registrado hoje:**  
${formatarNumero(dadosDia)} unidades

**Meta diária:**  
${formatarNumero(metaDadosDiaria)} unidades

${textoDadosDia}

━━━━━━━━━━━━━━━━━━━━

💳 **DADOS — SEMANA**

\`${barraDadosSemana}\` **${porcentagemDadosSemana}%**

**Registrado na semana:**  
${formatarNumero(dadosSemana)} unidades

**Meta semanal:**  
${formatarNumero(metaDadosSemanal)} unidades

${textoDadosSemana}

━━━━━━━━━━━━━━━━━━━━

💵 **DINHEIRO SUJO — SEMANA**

\`${barraDinheiroSujo}\` **${porcentagemDinheiroSujo}%**

**Registrado na semana:**  
${dinheiroSujoFormatado}

**Meta semanal:**  
${metaDinheiroSujoFormatada}

${textoDinheiroSujo}

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