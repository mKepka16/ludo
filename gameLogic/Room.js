const Queue = require('./Queue');
const Board = require('./Board');

class Room {
  constructor(id, close) {
    this.id = id;
    this.players = [];
    this.status = 'waiting';
    this.board = null;
    this.queue = new Queue(() => this.start());
    this.close = close;
  }

  start() {
    this.status = 'started';
    this.players = this.queue.players.map((player, index) => ({
      id: player.id,
      color: this.queue.colors[index],
      nick: player.nick,
    }));

    this.board = new Board(this.players, this.id, this.close);
  }
}

module.exports = Room;