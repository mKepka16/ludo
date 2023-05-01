class Dice {
  static getNumber() {
    const num = Math.floor(Math.random() * 6) + 1;
    return num;
  }
}

module.exports = Dice;