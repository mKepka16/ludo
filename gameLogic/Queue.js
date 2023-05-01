const state = require('./state.js');

class Queue {
  constructor(start) {
    this.startGame = start;
    this.lastId = 3;
    this.players = [
    //   { id: 1, nick: 'Kempix', ready: true, voted: true },
      // { id: 2, nick: 'Kempix2', ready: true, voted: false },
      // { id: 3, nick: 'Kempix3', ready: true, voted: true }
    ];
    this.colors = ['red', 'blue', 'green', 'yellow'];
    this.countingDown = false;
    this.timeLeft = 60;
    this.startingInterval = null;
    this.fastStarting = false;
  }

  join(nick) {
    if(this.players.length >= 4) 
      return false;
    if(this.players.filter(player => player.nick == nick).length > 0)
      return false;

    this.players.push({ id: ++this.lastId, nick, ready: false, voted: false });
    return true;
  }

  getReady(playerId) {
    this.players.forEach(player => {
      if(player.id == playerId) {
        player.ready = player.ready ? false : true;
      }
    })
  }

  vote(playerId) {
    this.players.forEach(player => {
      if(player.id == playerId) {
        player.voted = true;
      }
    })
  }

  starting() {
    this.startingInterval = setInterval(() => {
        this.timeLeft--;
        if(this.timeLeft <= 0) {
          this.startGame();
          clearInterval(this.startingInterval);
        }
    }, 1000);
  }

  shouldStart() {
    const voted = this.players.filter(({ voted }) => voted).length;
    if(this.players.length >= 2 && voted == this.players.length) {
      this.timeLeft = 3;
      this.countingDown = true;
      this.starting();
      return true;
    }

    const ready = this.players.filter(({ ready }) => ready).length;
    if(ready == 4) {
      this.timeLeft = 3;
      clearInterval(this.startingInterval);
      this.starting();
      return true;
    }
    
    return false;
  }
}

module.exports = Queue;