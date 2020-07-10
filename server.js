const express = require("express");
const getServers = require('./data.js')
require('dotenv').config()

let serverInfos = [],serverDatas = null
const app = express();
app.use(express.static("public"));

app.get("/", function(request, response) {
    response.sendFile(__dirname + "/views/index.html");
});

app.get('/api', async  function(request, response) {
    response.json(serverDatas);
})

// Run the server!
const start = async () => {
    async function updateServers() {
        serverInfos = await getServers()
        serverDatas = {
            data: serverInfos,
            created: new Date()
        }
    }

    try {
        await updateServers();
        setInterval(await updateServers,parseInt(process.env.updateDelay))
        const listener = app.listen(3001, function() {
            console.log("Your app is listening on port " + listener.address().port);
        });
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
start()