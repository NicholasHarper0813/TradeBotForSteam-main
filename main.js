const config = require('./config.json');
const configjs = require('./modules/config.js');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamTotp = require('steam-totp');
const SteamUser = require('steam-user');
const underscore = require('underscore');
const readline = require('readline');
const colors = require('colors');
const path = require('path');
const url = require('url');
const fs = require('fs');
const electron = require('electron');
const remote = require('electron').remote;
const market = require('./modules/steam-market-pricing');
const debug = require('./modules/debug.js');
const readValue = require('./modules/readvalue.js');
const offerStatusLog = require('./modules/offerStatuslog.js');
const mainMenuTemplateModule = require('./modules/templates/template');
const processOffer = require('./modules/offerHandling/processOffer')
const { app, BrowserWindow, Menu, ipcMain } = electron;

let ownerID = config.ownerID;
let gameid = config.game;
let trash = config.trashlimit;
let win, partner, theirprice, ourprice, ourItems, theirItems,ourValue,theirValue, allitems, allourItems;

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: 'en'
});

console.log('This bot was developed by Nicholas'.cyan);
console.log('Verision 1.2.5'.cyan);
console.log('Open sourcecode'.cyan);
console.log('Loading config file...'.green);
console.log('\n');
console.log('\n');
const logOnOptions = {
  accountName: config.username,
  password: config.password,
  twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
};

client.logOn(logOnOptions);
client.on('loggedOn', () => {
  console.log(`Logged into steam with account: ${config.username}`.green); //Displays the name of the account that's logged in.
  console.log('\n');
  console.log('Skin trash limit set to: ' + config.trashlimit);
  client.setPersona(1); //Shows that the bot is online.
  client.gamesPlayed(config.GameTitle);
});

app.on('ready', function () 
{
  win = new BrowserWindow({ width: 800, height: 600, icon: __dirname + '/img/bot.png', show: true }); //Initialized a new window.
  win.loadURL(url.format({
    pathname: path.join(__dirname + '/WebPage/index.html'),
    protocol: 'file',
    slashes: true
  }));
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplateModule);
  Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', function () 
{
  if (process.platform !== 'darwin') 
  {
    app.quit();
  }
});

client.on('webSession', (sessionid, cookies) => {
  manager.setCookies(cookies);
  community.setCookies(cookies);
  community.startConfirmationChecker(2000, config.identitySecret);
});

sendStatus = (ourprice, theirprice, profit, partner) => {
    win.webContents.send('accepted', {
      ourprice: ourprice,
      theirprice: theirprice,
      profit: profit,
      partner: partner
    });
}

manager.on('newOffer', (offer) => {
  debug("New offer recieved.");
  processOffer(offer, community).then(() => {
    debug("Offer was done processing.")
  });
});

ipcMain.on('configGames', (event, data) => {
  let newgame = data.game;
  console.log(data);
  configjs.confighandler('game', newgame);
});
