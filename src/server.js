import http from 'http'
import express from 'express'
import injectSocketIO from '../socketIoHandler'
import { handler } from '../build/handler'

const app = express()
const server = http.createServer(app)
const PORT = 3000

injectSocketIO(server)

app.use(handler)

server.listen(PORT, () => {
    console.log(`Running splitflag-HQ websockets server on http://localhost:${PORT}`)
})