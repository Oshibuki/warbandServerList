// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
})
const getServers = require('./data.js')
let serverInfos = [],serverDatas = null

// Declare a route
fastify.get('/', async (request, reply) => {
    return 
})

fastify.get('/api', async (request, reply) => {
    return serverDatas
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
        await fastify.listen(3000)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()