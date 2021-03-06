const express = require('express')
const path = require('path')

const http = require('http')
const socketIO = require('socket.io')

const PORT =process.env.PORT || 8000
const app = express()

app.use((req, res, next) => {
    console.log(req.method + " "+ req.url)
    next();
})
const users = []

const server = http.createServer(app)
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

const io = socketIO(server)

io.on('connection', (socket) => {
    console.log('new user connected')
    users.push(socket.id)

    socket.emit('updateAvaliable', function () { 
        console.log('Update Avaliable...')
    })
    socket.emit('emitted',()=>console.log('emitted'))

    socket.on('request', function (data) {
        console.log(data,'requested...')
    })
    socket.on('ask', (question) => {
        console.log(question)
        socket.emit('response', {
            answer: PORT
        })
        console.log(PORT)

    })

    socket.on('disconnect', () => {
        console.log('Client Disconnected')
    })
});


console.log(publicPath)

server.listen(PORT, () => {
    console.log('Server is Up at Port : ',PORT)
})