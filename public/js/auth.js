import Cookies from './cookies.js';

class Authorization {
  static async authorize() {
    const response = await fetch('/token/authorize', {
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`
      }
    });

    if(response.ok || response.status == 304) {
      const { player, redirectTo } = await response.json();


      if(player == null) {
        Cookies.removeItem('token');
        document.location.href = '/';
      }
      else {
        if(redirectTo == 'game' && document.location.pathname != `/game/${player.roomId}`)
          document.location.href = `/game/${player.roomId}`;
        else if(redirectTo == 'queue' && document.location.pathname != `/game/${player.roomId}/queue`) {
          document.location.href = `/game/${player.roomId}/queue`;
        }

        return player;
      }
    }
    else if(response.status == 401 || response.status == 403) {
      const path = document.location.pathname;
      const regex = /(nick)|(queue)|(^\/$)/;
      if(!regex.test(path))
        document.location.href = '/';
    }
    else {
      document.location.href = `/error`;
    }
  }

  static async getToken() {
    const response = await fetch('/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick: sessionStorage.getItem('nick'),
        room: sessionStorage.getItem('room')
      })
    })

    if(response.ok) {
      const { token, payload } = await response.json();
      Cookies.setItem('token', token);
      return payload;
    }
    else {
      document.location.href = `/error`;
    }
  }
}

export default Authorization;