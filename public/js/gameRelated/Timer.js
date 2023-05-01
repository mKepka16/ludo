class Timer {
  constructor() {
    this.timer = document.querySelector('.timer')
  }

  render(time) {
    this.timer.textContent = `${time}s`;
  }
}

export default Timer;