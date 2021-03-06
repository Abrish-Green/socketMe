const express = require('express')
const path = require('path')
const jQuery = require('jquery')
const http = require('http')
const socketIO = require('socket.io')
const ip = require('ip')
const moment = require('moment')
const PORT =process.env.PORT || 8001
const app = express()

const users = []
const ipAddress =  ip.address()
app.use((req, res, next) => {
    console.log(req.method + " "+ req.url)
    next();
})

const server = http.createServer(app)
const publicPath = path.join(__dirname, '../public')

console.log(publicPath)

app.use(express.static(publicPath))

const io = socketIO(server)

io.on('connection', (socket) => {
    users.push(socket.id)

    setInterval(() => {
       socket.emit('autoReload', {
         all_users: users
    }) 
    },1000)
    
    socket.emit('newUser', {
        from: 'Admin',
        text: 'Welcome to the Chat App',
        time: moment().format(' h:mm a'),
        all_users: users
    })
    socket.broadcast.emit('newUser', {
        from: 'Admin',
        text: 'User Joined',
        time: moment().format(' h:mm a'),
        all_users: users
    })
    socket.on('createMessage', (user) => {
        console.log(user)

        socket.emit('groupChat', {
            from: 'Me',
            text: user.text,
            time: moment().format(' h:mm a'),
             all_users: users
            
            
        })
        socket.broadcast.emit('groupChat', {
            from: 'Anonmyous',
            text: user.text,
            time: moment().format(' h:mm a'),
             all_users: users
        })
    })
    socket.on('ip', () => {
            socket.emit('getIP', {
                from: 'Me',
                ip: ipAddress,
                time: moment().format(' h:mm a')
            })
             socket.broadcast.emit('getIP', {
                from: 'Anonmyous',
                ip: ipAddress,
                time: moment().format(' h:mm a')
            })
        })
    socket.on('disconnect', () => {
        console.log('Client Disconnected')
        users.pop(socket.id)
    })
});

//console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))

server.listen(PORT, () => {
    console.log('Server is Up at Port : ',PORT)
})

