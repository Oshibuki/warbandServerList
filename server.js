const express = require("express");
const getServers = require("./data.js");
const compression = require("compression");
const cors = require("cors");
require("dotenv").config();

let serverInfos = [],
  serverDatas = null;
const app = express();

app.use(compression());
app.use(cors());
app.use(express.static("dist"));

app.get("/api", async function (request, response) {
  response.json(serverDatas);
});

// Run the server!
const start = async () => {
  async function updateServers() {
    serverInfos = await getServers();
    serverDatas = {
      rows: serverInfos,
      columns: [
        {
          label: "Name",
          field: "Name",
          sort: "asc",
        },
        {
          label: "ModuleName",
          field: "ModuleName",
          sort: "asc",
        },
        {
          label: "MapName",
          field: "MapName",
          sort: "asc",
        },
        {
          label: "NumberOfActivePlayers",
          field: "NumberOfActivePlayers",
          sort: "asc",
        },
        {
          label: "HasPassword",
          field: "HasPassword",
          sort: "asc",
        },
        {
          label: "IP",
          field: "IP",
          sort: "asc",
        },
      ],
    };
  }

  try {
    await updateServers();
    setInterval(await updateServers, parseInt(process.env.updateDelay));
    const listener = app.listen(process.env.PORT || 3001, function () {
      console.log("Your app is listening on port " + listener.address().port);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
