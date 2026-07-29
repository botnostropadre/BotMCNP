let client = null;

function setClient(botClient) {

    console.log("✅ setClient() executado.");

    client = botClient;

}

function getClient() {

    console.log("📌 getClient():", client ? "OK" : "NULL");

    return client;

}

module.exports = {

    setClient,

    getClient

};