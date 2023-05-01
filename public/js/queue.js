import Auth from './auth.js';
import Cookies from './cookies.js';


class Queue {
  constructor() {
    this.userData = null;
    
    Auth.authorize()
      .then(async payload => {
        if(!payload) {
          // Token needed
          this.userData = await Auth.getToken()
          
        }
        else {
          this.userData = payload;
        }
        this.fetchData();
      });
  }
  
  fetchData = () => {
    fetch(`/game/${this.userData.roomId}/queue/data`, {
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        this.updateDom(data)
        setTimeout(this.fetchData, 1000);
      })
  }

  updateDom = (
    { 
      queue: { players, colors } = {}, 
      starting, 
      seconds, 
      started
    }) => 
    {
    if(seconds == 0 || started) {
      document.location.href = `./`;
      return;
    }
    // Counter
    if(starting) {
      const h1 = document.querySelector('h1');
      h1.textContent = `Starting ${seconds}s`;
    }

    // Players
    const playersDOM = document.querySelector('.players').children;

    // Ready button
    const readyBtn = document.querySelector('.ready-btn, .unready-btn');
    readyBtn.onclick = this.getReady;

    // Reset
    [...playersDOM].forEach(playerDiv => {
      playerDiv.textContent = 'Empty';
      playerDiv.className = 'empty';
    })

    // Rendering players
    players.forEach((player, index) => {
      const p = playersDOM[index];
      p.className = 'player';
      // p.classList.remove('empty');
      p.classList.add(colors[index]);
      p.textContent = player.nick
      if(player.ready) p.classList.add('ready');

      if(player.id == this.userData.userId) {
        readyBtn.className = player.ready ? 'unready-btn' : 'ready-btn';
        readyBtn.textContent = player.ready ? 'Unready' : 'Ready'
      }
    });

    // Votes
    const voteStatusDOM = document.querySelector('.vote-status');

    const voteCount = players.filter(player => player.voted);

    voteStatusDOM.textContent = `${voteCount.length}/${players.length}`;

    const voteBtn = document.querySelector('.vote-btn');
    if(players.length < 2) {
      voteBtn.setAttribute('disabled', '');
    }
    else {
      voteBtn.removeAttribute('disabled');
      voteBtn.onclick = this.vote;
    }

    // Players count
    const playersCountDOM = document.querySelector('.players-count');
    playersCountDOM.textContent = `${players.length}/4`
  }

  getReady = () => {
    fetch(`/game/${this.userData.roomId}/queue/get-ready`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`
      }
    })
  }

  vote = () => {
    fetch(`/game/${this.roomId}/queue/vote`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`
      }
    })
  }
}

new Queue();