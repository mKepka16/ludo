class Popup {
  constructor(won, nick) {
    const whoWonText = document.querySelector('.who-win');
    const popup = document.querySelector('.popup-bg');

    popup.style.display = 'block';
    whoWonText.textContent = nick;
    whoWonText.classList.add(won);

  }
}

export default Popup;