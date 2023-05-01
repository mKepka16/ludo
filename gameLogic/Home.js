const Field = require("./Field");

class Home {
  constructor(owner, setWhoWon) {
    this.setWhoWon = () => setWhoWon(owner);
    this.owner = owner;
    this.fields = {
      1: new Field(1),
      2: new Field(2),
      3: new Field(3),
      4: new Field(4),
    }

    this.freeFieldIds = [1, 2, 3, 4];
  }

  joinPawn(pawn, diceNumbers) {
    const fieldsPassed = pawn.fieldsPassed;
    const normalFields = 39;
    const willPass = fieldsPassed + diceNumbers;
    const fieldID = willPass - normalFields;
    this.fields[fieldID].pawns.push(pawn);
    const index = this.freeFieldIds.indexOf(fieldID);

    if(index < 0) 
      return;

    this.freeFieldIds.splice(index, 1);
    if(this.freeFieldIds.length == 0) {
      this.setWhoWon();
    }
  }

  canJoin(pawn, diceNumbers) {
    const fieldsPassed = pawn.fieldsPassed;
    const normalFields = 39;
    const willPass = fieldsPassed + diceNumbers;
    const fieldId = willPass - normalFields;
    if(fieldId < 1 || fieldId > 4)
      return false;

    return this.freeFieldIds.includes(fieldId)
  }
}

module.exports = Home;