const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function criarEditorButtons() {

    return [

        // ==========================
        // LINHA 1
        // ==========================

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("embed_titulo")

                    .setLabel("📝 Título")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("embed_descricao")

                    .setLabel("📄 Descrição")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("embed_visual")

                    .setLabel("🎨 Visual")

                    .setStyle(ButtonStyle.Secondary)

            ),

        // ==========================
        // LINHA 2
        // ==========================

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("embed_imagens")

                    .setLabel("🖼 Imagens")

                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()

                    .setCustomId("embed_canal")

                    .setLabel("📢 Canal")

                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()

                    .setCustomId("embed_campo")

                    .setLabel("➕ Campo")

                    .setStyle(ButtonStyle.Primary)

            ),

        // ==========================
        // LINHA 3
        // ==========================

        new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId("embed_preview")

                    .setLabel("👁 Preview")

                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()

                    .setCustomId("embed_publicar")

                    .setLabel("✅ Publicar")

                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()

                    .setCustomId("embed_cancelar")

                    .setLabel("❌ Cancelar")

                    .setStyle(ButtonStyle.Danger)

            )

    ];

}

module.exports = {

    criarEditorButtons

};