// import express from 'express'
// import bodyParser from 'body-parser'
// import cors from 'cors'
import WebSocket, { WebSocketServer } from 'ws'

// const app = express()
const port = process.env.PORT || 8080

// app.use(bodyParser.json())
// app.use(cors())
//
// const server = app.listen(port, () => {
//   console.log(`Youtube Watch Party listening at port ${port}`)
// })

const webSocketServer = new WebSocketServer({ port })

const clientToUser = new Map()
let videoId
let videoPlaybackStatus
let currentPlayTime, lastCurrentPlayTimeUpdate

webSocketServer.on('connection', function (client) {
  console.log('WebSocket Client Connected')

  const sendToEveryoneElse = (message, isBinary = false) => {
    console.log('sendToEveryoneElse', message.toString())
    webSocketServer.clients.forEach(secondClient => {
      const userId = clientToUser.get(secondClient)

      console.log('Trying to send to client', message.toString(), userId, secondClient === client, secondClient.readyState)
      if (client === secondClient)
        return
      if (secondClient.readyState !== WebSocket.OPEN)
        return
      secondClient.send(message, { binary: isBinary })
    })
  }

  client.on('message', (message, isBinary) => {
    console.log('WebSocket Server Received message.', message.toString())

    const parsedMessage = JSON.parse(message)

    if (parsedMessage.action === 'join') {
      clientToUser.set(client, parsedMessage.userId)
    } else if (parsedMessage.action === 'load') {
      videoId = parsedMessage.videoId
    } else if (parsedMessage.action === 'play') {
      videoPlaybackStatus = 'playing'
      currentPlayTime = parsedMessage.currentPlayTime
      lastCurrentPlayTimeUpdate = Date.now() / 1000
    } else if (parsedMessage.action === 'pause') {
      videoPlaybackStatus = 'paused'
      currentPlayTime = parsedMessage.currentPlayTime
      lastCurrentPlayTimeUpdate = Date.now() / 1000
    }

    sendToEveryoneElse(message, isBinary)

    client.send(JSON.stringify({
      action: 'partyState',
      videoId,
      videoPlaybackStatus,
      currentPlayTime: videoPlaybackStatus === 'paused' ?  currentPlayTime : currentPlayTime + Date.now() / 1000 - lastCurrentPlayTimeUpdate,
      users: [...webSocketServer.clients].map(client => clientToUser.get(client)) // TODO: map entries instead. if they have not sent a 'join' message, ignore them.
    }))
  })

  client.on('close', () => {
    console.log('WebSocket Client Closed')

    sendToEveryoneElse(JSON.stringify({
      action: 'leave',
      userId: clientToUser.get(client),
    }))

    clientToUser.delete(client)
  })

})

console.log(`Youtube Watch Party listening at port ${port}`)
