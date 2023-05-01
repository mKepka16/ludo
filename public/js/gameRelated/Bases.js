import Cookies from '../cookies.js';

class Bases {
  constructor() {
    this.bases = {
      red: document.querySelector('.base.red'),
      blue: document.querySelector('.base.blue'),
      green: document.querySelector('.base.green'),
      yellow: document.querySelector('.base.yellow')
    }
  }

  render(bases, canLeave, color) {
    bases.forEach(({ owner, pawns }) => {
      this.bases[owner].innerHTML = '';
      
      pawns.forEach((pawn, index) => {
        const pawnDiv = document.createElement('div');
        pawnDiv.classList.add('pawn');
        pawnDiv.innerHTML = `<img src="../../imgs/${owner}_pawn.svg" alt="">`;

        if(index == pawns.length-1 && canLeave && owner == color) {
          pawnDiv.classList.add('active');
          pawnDiv.onclick = () => this.leavePawn();
        }

        this.bases[owner].appendChild(pawnDiv);
      })
    })
  }

  async leavePawn() {
    const response = await fetch('/game/leave-base', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`
      }
    });
  }
}

export default Bases;