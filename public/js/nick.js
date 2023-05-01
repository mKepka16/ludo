import Auth from './auth.js';

class Nick {
  constructor() {
    Auth.authorize()
    
    // Getting room id
    let url = window.location.href;
    url = url.replaceAll('?', '/');
    url = url.split('/').filter(el => el != '');
    
    const roomId = url[url.length-1];
    sessionStorage.setItem('room', roomId);
    
    
    const form = document.forms[0];
    
    form.action = `/game/${roomId}/queue`;
    
    const nickInp = document.getElementById('nick');
    
    nickInp.addEventListener('input', (e) => {
      sessionStorage.setItem('nick', e.target.value.trim())
    })
  }
}

new Nick();