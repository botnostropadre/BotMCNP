const { EmbedBuilder } = require("discord.js");
const COLORS = require("../config/colors");

function criarPainelEmbeds() {

    return new EmbedBuilder()

        .setColor(COLORS.VERDE)

        .setTitle("📝 Central de Gerenciamento de Embeds")

        .setDescription(`
# 🇮🇹 Padre Nosso MC

Bem-vindo ao **Editor Profissional de Embeds**.

Utilize os botões abaixo para criar, editar e publicar mensagens totalmente personalizadas.

## Ferramentas disponíveis

📝 Alterar título

📄 Alterar descrição

🎨 Personalizar visual

🖼 Configurar imagens

📢 Selecionar canal

➕ Adicionar campos

👁 Visualizar Preview

✅ Publicar Embed

━━━━━━━━━━━━━━━━━━━━━━

### Em breve

💾 Salvar modelos

📂 Biblioteca de Templates

✏ Editar mensagens já publicadas

🗑 Excluir Templates

🔄 Duplicar Embeds

━━━━━━━━━━━━━━━━━━━━━━

Escolha uma opção utilizando os botões abaixo.
`)

        .setFooter({

            text: "🇮🇹 Padre Nosso MC • Sistema de Embeds"

        })

        .setTimestamp();

}

module.exports = {

    criarPainelEmbeds

};