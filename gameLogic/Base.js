const Pawn = require('./Pawn.js');
const BaseField = require('./BaseField');

class Base {
  constructor(owner, allFields) {
    this.owner = owner;
    this.allFields = allFields;
    this.pawns = [
      new Pawn(owner, 1),
      new Pawn(owner, 2),
      new Pawn(owner, 3),
      new Pawn(owner, 4)
    ];
  }

  leavePawn() {
    if(this.pawns.length == 0) 
      return false;

    const id = BaseField.ids[this.owner];
    const lastPawn = this.pawns.pop();
    this.allFields[id].pawns.push(lastPawn);
    return true;
  }

  joinPawn(pawn) {
    this.pawns.push(pawn);
  }
}

module.exports = Base;