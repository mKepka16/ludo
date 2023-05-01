import Bases from './Bases.js';
import Dice from './Dice.js';
import Fields from './Fields.js';
import Homes from './Homes.js';
import Timer from './Timer.js';

class Board {

  constructor(color) {
    this.initCanvas();
    this.color = color;
    this.bases = new Bases();
    this.homes = new Homes();
    this.dice = new Dice(() => this.render());
    this.fields = new Fields();
    this.turn = document.querySelector('#turn');
    this.timer = new Timer();
  }

  render(board, isMyTurn) {
    this.setTurn(board.players, board.turn);
    this.bases.render(
      board.bases,
      isMyTurn && [1, 2].includes(board.turnStatus),
      this.color
    );

    this.fields.render(
      board.fields, // Fields to render 
      isMyTurn && [1, 2, 3].includes(board.turnStatus), // Should move
      this.dice.number, 
      this.color  
    ); //Hover helper

    this.dice.render(isMyTurn && board.turnStatus == 0);

    this.homes.render(board.homes);

    this.timer.render(board.timeLeft);
  }

  initCanvas() {
    this.canvas = document.querySelector('#root');
    this.ctx = this.canvas.getContext('2d');

    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    }
    image.src = '../imgs/board.png';
  }

  setTurn(players, turn) {
    const nick = players.filter(player => player.color == turn)[0].nick;
    this.turn.textContent = nick;
    this.turn.className = turn;
  }
}

export default Board;