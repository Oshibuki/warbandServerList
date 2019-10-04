var parser = require('fast-xml-parser');
var http = require('http');
var net = require('net')
var rp = require('request-promise');

function reflect(promise) {
    return promise.then(
        (v) => {
            return { status: 'fulfilled', value: v };
        },
        (error) => {
            return { status: 'rejected', reason: error };
        }
    );
}

async function getServerInfos(ipList) {
    let serverListInfos = []
    function getInfo(ip, port) {
        return new Promise((resolve, reject) => {
            try {
                var client = net.createConnection(port, ip);
                client.setTimeout(3000);
                var bodyString = ``

                client.on('data', function (chunk) {
                    bodyString += chunk
                });

                client.on('close', function (data) {
                    var json = parser.parse(bodyString);
                    resolve(json.ServerStats)
                });

                client.on('error', function (error) {
                    reject()
                });
                client.on('timeout', function (error) {
                    reject(error)
                });
            } catch (e) {
                console.log('___________error in socket connect_______________')
                reject(error);
            }
        })

    }

    let promises = []
    for (let ipItem of ipList) {
        let [ip, port] = [...ipItem.split(':')]

        const defaultGamePort = '7240';
        port = port ? port : defaultGamePort;
        promises.push(getInfo(ip, port))
    }
    promises = promises.map(reflect)
    const results = await Promise.all(promises);
    const successfulResults = results.filter(p => p.status === 'fulfilled');
    successfulResults.forEach(i=>serverListInfos.push(i.value))
    return  serverListInfos
}


function getServers() {
    return rp(process.env.sourceUrl).then(htmlString=>{
        let ipList = htmlString.split('|')
        return getServerInfos(ipList)
    })
}

module.exports = getServers