const Base = require('./Base.js');
const Field = require('./Field');
const BaseField = require('./BaseField');
const Dice = require('./Dice');
const Home = require('./Home.js');

class Board {
  constructor(players, id, close) {
    this.id = id;
    this.close = close;
    this.players = players;
    this.turn = 'blue';
    this.turnStatus = 0;
    this.diceNumber = null;
    this.timeLeft = 30;
    this.timeCounterInterval = null;
    this.startInterval();
    this.won = null;
    this.winner = null;
    
    // Fields init
    this.fields = {};
    for(let i=1; i<=40; i++) {
      const field = i % 10 == 1 ? new BaseField(i) : new Field(i);
      this.fields[i] = field;
    }

    // Bases init
    this.bases = players.map(player => new Base(player.color, this.fields));

    // Homes init
    this.homes = {
      red: new Home('red', color => this.setWhoWon(color)),
      blue: new Home('blue', color => this.setWhoWon(color)),
      yellow: new Home('yellow', color => this.setWhoWon(color)),
      green: new Home('green', color => this.setWhoWon(color))
    }
  }

  setWhoWon(color) {
    this.won = color;
    this.winner = this.getNickByColor(color);

    setTimeout(() => {
      this.close();
    }, 7000);
  }

  getNickByColor(color) {
    return this.players.filter(player => player.color == color)[0].nick;
  }

  canDoAnything() {
    let canDo = false;

    // Can leave the base?
    const base = this.getBaseByColor(this.turn);
    if(base.pawns.length > 0 &&
      (this.turnStatus == 1 ||
      this.turnStatus == 2))
      canDo = true;

    // Can move on any field
    Object.values(this.fields).forEach(field => {
      const pawn = field.hasPawn(this.turn);
      if(pawn) {
        if(pawn.fieldsPassed + this.diceNumber > 39) {
          if(this.homes[this.turn].canJoin(pawn, this.diceNumber))
            canDo = true;
        }
        else
          canDo = true;
      }
    })

    if(!canDo)
      this.nextTurn();
  }

  startInterval() {
    if(this.timeCounterInterval)
      clearInterval(this.timeCounterInterval);

    this.timeLeft = 30;
    this.timeCounterInterval = setInterval(() => {
      this.timeLeft--;

      if(this.timeLeft <= 0) {
        this.nextTurn();
      }
    }, 1000);
  }

  getBaseByColor(owner) {
    if(owner == 'red') return this.bases[0];
    if(owner == 'blue') return this.bases[1];
    if(owner == 'green') return this.bases[2];
    if(owner == 'yellow') return this.bases[3];
  }

  movePawn(owner, fromId, numOfFields) {

    const pawns = this.fields[fromId].pawns.filter(pawn => pawn.owner == owner);
    if(pawns.length == 0) return false;

    const pawn = pawns[0];
    const index = this.fields[fromId].pawns.indexOf(pawn);

    if(index <= -1) 
      return false;

      // Home section
    if(pawn.fieldsPassed + numOfFields > 39) {
      const home = this.homes[owner];
      const canJoin = home.canJoin(pawn, numOfFields);
      if(canJoin) {
        const deleted = this.fields[fromId].pawns.splice(index, 1)[0];
        home.joinPawn(deleted, numOfFields);
        this.startInterval();
        return true;
      }
      return false;
    }

    // Normal move
    const deleted = this.fields[fromId].pawns.splice(index, 1)[0];
    let newId = parseInt(fromId)+numOfFields;
    if(newId > 40) newId -= 40;

    deleted.passFields(numOfFields);
    this.fields[newId].pawns.push(deleted);
    this.captureTheField(owner, newId);
    this.startInterval();

    return true;
  }

  captureTheField(owner, fieldId) {
    if([1, 11, 21, 31].includes(fieldId))
      return;

    const field = this.fields[fieldId];
    const ownFields = [];

    field.pawns.forEach(pawn => {
      if(pawn.owner == owner)
        return ownFields.push(pawn);

      const base = this.getBaseByColor(pawn.owner);

      pawn.reset();
      base.joinPawn(pawn);
    })

    field.pawns = ownFields;
  }

  rollTheDice(player) {
    // return this.close();
    if(this.turnStatus == 0 && this.turn == player) {
      this.diceNumber = Dice.getNumber();

      if(this.diceNumber == 1) {
        this.turnStatus = 1;
      }

      else if(this.diceNumber == 6) {
        this.turnStatus = 2;
      }

      else {
        const base = this.getBaseByColor(this.turn);
        if(base.pawns.length == 4)
          this.nextTurn();
        else
          this.turnStatus = 3;
      }
      this.canDoAnything();
      this.startInterval();
      return true;
    }
    return false;
  }

  nextTurn() {
    let found = false;

    this.players.forEach((player, index) => {
      if(found)
        return;

      if(player.color != this.turn)
        return;

      index += 1;
      if(index == this.players.length)
        index = 0;

      const nextPlayer = this.players[index];
      const color = nextPlayer.color;

      found = true;
      this.turn = color;
      this.turnStatus = 0;
      this.startInterval();
    })
  }
}

module.exports = Board;