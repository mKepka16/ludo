import Cookies from '../cookies.js';

class Fields {
  constructor() {
   this.fields = document.querySelectorAll('.field:not([data-field-id*="-"], [data-field-id=empty])');

   this.fields.forEach(field => {
     field.addEventListener('DOMNodeInserted', e => this.containPawns(e, field))
     field.addEventListener('DOMNodeRemoved', e => this.containPawns(e, field))
    });
  }

  containPawns(e, field) {
    if(e.relatedNode != field) 
      return;

    const childrenCount = [...field.children].length;

    const hasClassTo4 = field.classList.contains('more-pawns');

    if(hasClassTo4 && childrenCount <= 1)
      return field.classList.remove('more-pawns');

    if(!hasClassTo4 && childrenCount > 1)
      return field.classList.add('more-pawns');
    

  }

  render(fields, canMove, diceNumber, color) {
    Object.values(fields).forEach(field => {
      const { id, pawns } = field;
      const div = document.querySelector(`.field[data-field-id="${id}"]`)
      div.innerHTML = '';
      div.className = 'field';
      div.onmouseenter = undefined;
      div.onmouseleave = undefined;
      div.onclick = undefined;
      
      pawns.forEach(pawn => {
        const pawnDiv = document.createElement('div');
        pawnDiv.classList.add('pawn');
        pawnDiv.classList.add(`pawn-${pawn.owner}`);
        pawnDiv.innerHTML = `<img src="../../imgs/${pawn.owner}_pawn.svg"; alt="" />`
        div.appendChild(pawnDiv);

        if(canMove && color == pawn.owner) {
          
          // Going to home
          if(pawn.fieldsPassed + diceNumber > 39) {
            const fieldId = pawn.fieldsPassed + diceNumber - 39;

            if(fieldId < 1 || fieldId > 4)
              return;

            const homeField = document.querySelector(`[data-field-id="${pawn.owner}-${fieldId}"]`);
            const isOccupied = homeField.children.length > 0;
            
            if(isOccupied) 
              return;
            
            div.onmouseenter = () => homeField.classList.add('move-location');
            div.onmouseleave = () => homeField.classList.remove('move-location');
            div.classList.add('active');
            div.onclick = () => this.movePawn(id); 
            return
          }
          div.classList.add('active');
          div.onclick = () => this.movePawn(id);     
          
          // Hover elements
          const afterMoveId = id + diceNumber > 40 ? id + diceNumber - 40 : id + diceNumber;
          const afterMoveDiv = document.querySelector(`.field[data-field-id="${afterMoveId}"]`)
          
          // Hover effect
          div.onmouseenter = () => afterMoveDiv.classList.add('move-location');
          div.onmouseleave = () => afterMoveDiv.classList.remove('move-location');
        }
      })
    })
  }

  async movePawn(fieldId) {
    const response = await fetch(`/game/move/${fieldId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.getItem('token')}`
      }
    });
  }
}

export default Fields;