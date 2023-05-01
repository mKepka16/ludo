class Field {
  constructor(id) {
    this.id = id;
    this.pawns = [

    ];
  }

  hasPawn(owner) {
    const pawns = this.pawns.filter(pawn => pawn.owner == owner);
    if(pawns.length > 0)
      return pawns[0];
    return false;
  }
}

module.exports = Field;