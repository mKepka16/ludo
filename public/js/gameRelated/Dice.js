import Cookies from '../cookies.js';

class Dice {
  constructor() {
    this.img = document.querySelector('.left-bar img');
    this.btn = document.querySelector('.left-bar button');
    this.number = null;
    this.synth = window.speechSynthesis;
    this.voice = false;
    speechSynthesis.onvoiceschanged = () => {
      const voices = this.synth.getVoices();
    
      this.voice = voices.filter(voice => voice.lang == "pl-PL")[0];
    }
  }

  render = (shouldBeActive) => {
    if(shouldBeActive)
      return this.enable();
    this.disable();
  }

  async roll() {
    const response = await fetch('/game/roll-dice', {
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`
      }
    });
    if(!response.ok)
      return false;
    const { diceNumber } = await response.json();
    const time = 50;
    
    this.number = diceNumber;

    this.disable();
    this.animation(time, diceNumber);
    

  }

  animation(time, diceNumber) {
    if(time > 200) {
      this.img.src = `../../imgs/cube_${diceNumber}.png`;

      const utterThis = new SpeechSynthesisUtterance(diceNumber.toString());
      if(this.voice)
        utterThis.voice = this.voice;

      this.synth.speak(utterThis)
    }
    else {
      this.img.src = `../../imgs/cube_${this.getRandNumber()}.png`;

      setTimeout(() => this.animation(time+20, diceNumber), time);
    }
  }

  getRandNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  disable() {
    this.btn.onclick = null;
    this.btn.setAttribute('disabled', '');
  }

  enable() {
    this.btn.onclick = () => this.roll();
    this.btn.removeAttribute('disabled');
  }
}

export default Dice;