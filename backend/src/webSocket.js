const socketIo = require('socket.io');
const parseStringToArray = require('./utils/parseStringToArray')
const calculateDistance = require('./utils/calculateDistance')

let io;
const connections = []

exports.setupWebsocket = (server) => {
  io = socketIo(server);

  io.on('connection', socket => {

    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techs: parseStringToArray(techs)
    })
  })
}

exports.findConnections = (coordinates, tecks) => {
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10
      && connection.techs.some(item => tecks.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data)
  })
}
