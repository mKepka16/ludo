const { Router } = require('express');
const path = require('path');
const state = require('../gameLogic/state');
const { authenticateUser } = require('../utilities');

//  Router init
const router = Router();

// Queue
router.get('/:id/queue', (req, res) => {
  const queue = state.getRoomById(req.params.id).queue;
  if(req.query?.nick?.trim()) {
    if(queue.join(req.query.nick.trim())) {
      res.sendFile(path.resolve(__dirname + "/../public/queue.html"));
    }
    else {
      res.redirect('/error/cannot-join-queue');
    }
  }
  else {
    // res.sendStatus(204);
    res.sendFile(path.resolve(__dirname + "/../public/queue.html"));
  }
});

router.get('/:id/queue/data', authenticateUser, (req, res) => {
  const payload = req.payload;
  const room = state.getRoomById(payload.roomId)
  const queue = room.queue;

  if(req.params.id != payload.roomId)
    return res.sendStatus(401);

  // if(queue.shouldStart()) {
  //   return res.send({ started: true })
  // }

  if(queue.players.length == 4 && !queue.countingDown) {
    queue.countingDown = true;
    queue.starting();
  }

  if(!queue.fastStarting) {
    if(queue.shouldStart()) {
      queue.fastStarting = true;
    }
  }

  const queueCopy = {...queue};
  delete queueCopy.startingInterval;

  if(queue.countingDown) {
    res.send({ queue: queueCopy, starting: true, seconds: queue.timeLeft })
  }
  else {
    res.send({ queue: queueCopy });
  }

});

router.put('/:id/queue/get-ready', authenticateUser, (req, res) => {
  const payload = req.payload;
  const queue = state.getRoomById(payload.roomId).queue;

  if(req.params.id != payload.roomId)
    return res.sendStatus(401);

  queue.getReady(payload.userId);

  res.sendStatus(204);
});

router.put('/:id/queue/vote', authenticateUser, (req, res) => {
  const payload = req.payload;
  const queue = state.getRoomById(payload.roomId).queue;
  
  queue.vote(payload.userId);

  res.sendStatus(204);
});

// Game

router.get('/roll-dice', authenticateUser, (req, res) => {
  const payload = req.payload;
  const board = state.getRoomById(payload.roomId).board;
  const color = board.players.filter(player => player.nick == payload.nick)[0].color;

  if(board.rollTheDice(color)) {
    console.log(board.diceNumber);
    res.send({ diceNumber: board.diceNumber });
  }
  else
    res.sendStatus(400);
})

router.get('/data', authenticateUser, (req, res) => {
  const payload = req.payload;
  const room = state.getRoomById(payload.roomId);
  const board = room.board;

  if(board.won) {
    return res.send({ won: board.won, nick: board.winner })
  }

  const color = board.players.filter(player => player.nick == payload.nick)[0].color;
  const boardCopy = {...board};
  delete boardCopy.timeCounterInterval;

  res.send({ board: boardCopy, color });
})

router.put('/move/:fieldId', authenticateUser, (req, res) => {
  const payload = req.payload;
  const board = state.getRoomById(payload.roomId).board;
  const color = board.players.filter(player => player.nick == payload.nick)[0].color;
  const fieldId = req.params.fieldId;

  if(color == board.turn) {
    const success = board.movePawn(color, fieldId, board.diceNumber);
    if(!success) 
      return res.sendStatus(400);

    if([1, 3].includes(board.turnStatus)) {
      board.nextTurn();
      return res.sendStatus(200);
    }

    if(board.turnStatus == 2) {
      board.turnStatus = 0;
      
      res.sendStatus(200);
    }
  }
})

router.put('/leave-base', authenticateUser, (req, res) => {
  const payload = req.payload;
  const board = state.getRoomById(payload.roomId).board;
  const color = board.players.filter(player => player.nick == payload.nick)[0].color;

  if(color != board.turn) 
    return res.sendStatus(400);

  if(![1, 2].includes(board.turnStatus)) 
    return res.sendStatus(400);

  const success = board.getBaseByColor(color).leavePawn();

  if(!success)
    return res.sendStatus(400);

  if(board.turnStatus == 1)
    board.nextTurn();
  else if(board.turnStatus == 2)
    board.turnStatus = 0;

  res.sendStatus(200);
})

router.get('/:id/', (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/game.html"));
});

module.exports = router;