const { Router } = require('express');
const state = require('./../gameLogic/state');

//  Router init
const router = Router();

router.get('/', (req, res) => {
  state.manageRooms();

  const rooms = state.rooms.map(room => ({
    id: room.id,
    status: room.status,
    players: room.players.length,
    playersInQueue: room.queue.players.length
  }));
  res.send(rooms);
});

module.exports = router;