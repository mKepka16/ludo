class Pawn {
  constructor(owner, id) {
    this.owner = owner;
    this.id = id;
    this.fieldsPassed = 0;
  }

  reset() {
    this.fieldsPassed = 0;
  }

  passFields(count) {
    this.fieldsPassed += count;
  }

  // move(from, to) { // (field, field)
  //   const index = from.indexOf(this);
  //   if(index > -1) {
  //     const deleted = from.splice(index, 1)[0];
  //     to.push(deleted);
  //   }
  // }
}

module.exports = Pawn;