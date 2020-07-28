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
          label: "名称",
          field: "Name",
          sort: "asc",
        },
        {
          label: "在线人数",
          field: "NumberOfActivePlayers",
          sort: "asc",
        },
        {
          label: "mod",
          field: "ModuleName",
          sort: "asc",
        },
        {
          label: "地图",
          field: "MapName",
          sort: "asc",
        },
        {
          label: "是否有密码",
          field: "HasPassword",
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
