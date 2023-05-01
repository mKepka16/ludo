import Auth from './auth.js';
import Cookies from './cookies.js';
import Board from './gameRelated/Board.js';
import Popup from './gameRelated/Popup.js';

class Game {
  constructor() {
    this.payload = null;
    this.color = null;
    this.board = null;

    Auth.authorize()
      .then(pl => {
        this.payload = pl;
        this.fetchData();
      });
  }

  fetchData = async () => {
    const response = await fetch('/game/data', {
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`
      }
    })

    if(response.status != 304 && !response.ok) {
      setTimeout(() => this.fetchData(), 1000);
      return;
    }
    const json = await response.json();

    // If sb won
    if(json.won) {
      const popup = new Popup(json.won, json.nick);

      setTimeout(() => {
        Cookies.removeItem('token');
        document.location.href = '/';
      }, 5000);

      return;
    }

    // If got data
    this.color = json.color;
    this.renderBoard(json.board);

    setTimeout(() => this.fetchData(), 1000);
  }

  renderBoard = (data) => {
    if(!this.board)
      this.board = new Board(this.color);

    this.board.render(data, this.color == data.turn);
  }
}

new Game();