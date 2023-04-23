import { Server } from "socket.io"

// @ts-ignore
export default function injectSocketIO(server) {
    const io = new Server(server)

    io.on('connection', socket => {
        // socket.emit('name', username)

        socket.on('message', ({ message, username }) => {
            io.emit('message', {
                from: username,
                message,
                time: new Date().toLocaleString()
            })
        })
    })

    console.log('SocketIO injected!')
}