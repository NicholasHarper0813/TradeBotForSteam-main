const config = require('../../../config.json');
const configjs = require('../../../modules/config');

const label = document.getElementById('label');
const trashlimit = document.getElementById('trashlimit');

trashlimit.value = config.trashlimit;
let btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    configjs.confighandler('trashlimit', trashlimit.value);
    label.innerHTML = 'Updated to game: ' + trashlimit.value;
    window.close();
});
