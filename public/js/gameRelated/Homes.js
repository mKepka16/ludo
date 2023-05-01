class Homes {

  render(homes) {
    for(const owner in homes) {
      const home = homes[owner];
      for(const fieldId in home.fields) {
        const { pawns } = home.fields[fieldId];
        if(pawns.length == 0)
          continue;

        const div = document.querySelector(`[data-field-id="${owner}-${fieldId}"]`);
        div.className = 'field';

        const pawnDiv = document.createElement('div');
        pawnDiv.classList.add('pawn');
        pawnDiv.classList.add(`pawn-${owner}`);
        pawnDiv.innerHTML = `<img src="../../imgs/${owner}_pawn.svg"; alt="" />`

        div.innerHTML = '';
        div.appendChild(pawnDiv);
      }
    }
  }
}

export default Homes;