require('dotenv').config();
const { Router } = require('express');
const state = require('../gameLogic/state');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utilities')

//  Router init
const router = Router();

router.post('/', (req, res) => {
  const { nick, room } = req.body;
  const exists = state.getRoomById(room)?.queue?.players?.filter(user => user.nick == nick);

  if(exists && exists.length > 0) {
    const userId = state.getRoomById(room).queue.players.filter(user => user.nick == nick)[0].id;
    const payload = {
      userId,
      roomId: room,
      nick
    }
  
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.send({ token: accessToken, payload });
  }
  else {
    res.sendStatus(400)
  }

})

router.get('/authorize', authenticateUser, (req, res) => {
  const { nick, roomId, userId } = req.payload;
  const exists = state.getRoomById(roomId)?.queue?.players?.filter(user => user.nick == nick && user.id == userId);
  if(exists && exists.length > 0) {
    const status = state.getRoomById(roomId).status;
    if(status == 'started') {
      res.send({ player: req.payload, redirectTo: 'game' });
    }
    else if(status == 'waiting') {
      res.send({ player: req.payload, redirectTo: 'queue' });
    }
    else {
      res.status(500).send({ error: "Sorry, there is a problem with room status" });
    }
  }
  else {
    res.send({ player: null, redirectTo: 'home' }) // Client should delete token
  }
})

module.exports = router;