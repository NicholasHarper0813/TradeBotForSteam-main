const configjs = require('../../../modules/config');
let game = document.getElementById('game');
let btn = document.getElementById('btn');
let label = document.getElementById('label');

btn.addEventListener('click', () => {
    configjs.confighandler('game', game.value);
    label.innerHTML = 'Updated to game: ' + game.value;
    window.close();
});
