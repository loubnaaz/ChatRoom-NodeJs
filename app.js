const express = require ('express')
const path = require ('path') //package inside node js 
const app = express ()
const PORT = process.env.PORT || 4000 // definition du port
const server = app.listen (PORT , ()=>{
    console.log(`listening to port ${PORT}`)
})

const io = require('socket.io') (server) //initialisation du web socket server

app.use(express.static(path.join(__dirname, '/public')))

//total number of ppl connected:
let socketsConnected = new Set() // Set = each socket id is unique

//listen for an event on the websocket server
io.on('connection', onConnected)

function onConnected(socket){
    console.log("id of socket server :" , socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)

    socket.on('disconnect',()=>{//remove the spcket id when user is disconnected
    console.log('socket disconnected', socket.id)
    socketsConnected.delete(socket.id)
    io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
    
        // console.log(data)
        socket.broadcast.emit('chat-message', data)
      })

      socket.on('feedback', (data) => {
        // console.log(data)
        socket.broadcast.emit('feedback', data)
      })

}



