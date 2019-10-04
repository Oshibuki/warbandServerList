const express = require("express");
const getServers = require('./data.js')

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
        setInterval(await updateServers,300*1000)
        const listener = app.listen(process.env.PORT, function() {
            console.log("Your app is listening on port " + listener.address().port);
        });
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()