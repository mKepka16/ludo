import Auth from './auth.js'; 

class Rooms {
  constructor() {
    this.roomsDiv = document.querySelector('.availableRooms');

    Auth.authorize()
    this.fetchRoom();
    setInterval(this.fetchRoom, 2000);
  }

  renderRooms = (rooms) => {
    this.roomsDiv.innerHTML = '';
    rooms.forEach(({ id, status, players, playersInQueue }) => {
      const roomDiv = document.createElement('div');
      roomDiv.classList.add('room');
    
      roomDiv.innerHTML = `
        <h5>Room: ${id} <span class="status ${status}">${status}</span></h5>
        <span class="players">${status == 'started' ? players : playersInQueue}/4</span>
        <form action="/nick/${id}" method="GET">
          <button type="submit" ${status == 'started' && 'disabled'}>Join</button>
        </form>
      `;

      this.roomsDiv.appendChild(roomDiv);
    })
  }

  fetchRoom = () => {
    fetch('/rooms')
      .then(response => response.json())
      .then(this.renderRooms)
  };
}

new Rooms();




