const config = require('../../../config.json');
const configjs = require('../../../modules/config');
const label = document.getElementById('label');
const electron = require('electron');
const shell = electron.shell;
const sSecret = document.getElementById('sSecret');
const iSecret = document.getElementById('iSecret');
sSecret.value = config.sharedSecret;
iSecret.value = config.identitySecret;

let externalLink = document.getElementById('link');
let btn = document.getElementById('btn');

link.addEventListener('click', () => {
    shell.openExternal('https://github.com/SteamTimeIdler/stidler/wiki/Getting-your-%27shared_secret%27-code-for-use-with-Auto-Restarter-on-Mobile-Authentication#getting-shared-secret-from-steam-desktop-authenticator-windows');
});

btn.addEventListener('click', () => {
    if (iSecret.value !== '') 
    {
        configjs.confighandler('identitySecret', iSecret.value);
    }
    if(sSecret.value !== '')
    {
        configjs.confighandler('sharedSecret', sSecret.value);
    }
    
    window.close();
    label.innerHTML = 'Updated values';
});
