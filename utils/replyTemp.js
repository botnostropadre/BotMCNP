async function replyTemp(interaction, options, tempo = 5000) {

    await interaction.reply({

        ...options,

        flags: 64

    });

    setTimeout(async () => {

        try {

            await interaction.deleteReply();

        } catch (err) {}

    }, tempo);

}

module.exports = {

    replyTemp

};