const market = require('../steam-market-pricing');
const readValue = require('../readvalue');
const debug = require('../debug');
const colors = require('colors');
const fs = require('fs');
const acceptOffer = require('./acceptOffer');
const declineOffer = require('./declineOffer');
const saveTrade = require('../saveTrades.js');

module.exports = async (offer, community) => {
  return new Promise(resolve => {
    readValue.readValues().then(res => {
      let gameid = res.game;
      let trash = res.trashlimit;
      let ownerID = res.ownerID;

      if (offer.isGlitched() || offer.state === 11) 
      {
        console.log("The offer was glitched, declining".red);
        declineOffer(offer, "Offer Clitched");
        resolve();
      }
      else if (offer.partner.getSteamID64() === ownerID)
      {
        console.log("Trade partner is owner");
        acceptOffer(offer).then(() => debug("Accepted the offer with the owner"));
        resolve();
      }
      else 
      {
        partner = offer.partner.getSteamID64();
        ourprice = 0;
        theirprice = 0;
        ourItems = offer.itemsToGive;
        theirItems = offer.itemsToReceive;
        ourValue = 0;
        theirValue = 0;

        allitems = [];
        allourItems = [];
        for (let i in theirItems) 
        {
          allitems.push(theirItems[i].market_hash_name);
        }
        
        for (let i in ourItems)
        {
          allourItems.push(ourItems[i].market_hash_name);
        }

        if (allitems.length > 0) 
        {
          market.getItemsPrice(gameid, allitems, function (data) 
          {
            console.log('\n');
            console.log('================= New Trade ===================='.green);
            for (let i in allitems)
            {
              if (data[i] !== undefined)
              {
                let inputData = data[i].lowest_price;
                let currentData = tostring.slice(1, 5);
                let tostring = inputData.toString();
                let parseData = parseFloat(currentData);
                if (parseData < trash) 
                {
                  parseData = 0.01;
                  theirprice += parseData;
                  console.log("They offered a trash skin: ".red + data[i].name);
                } 
                else 
                {
                  theirprice += parseData;
                  console.log("They offered: ".red + data[i].name);
                }
              }
              else 
              {
                console.log(data[i]);
                console.log('Someone tried to trade items from another game..');
              }
            }
            console.log('Their Value: '.blue + theirprice);
            
            if (allourItems.length == 0) 
            {
              debug("No items from us inside the tradeoffer");
              acceptOffer(offer);
              resolve();
            } 
            else 
            {
              market.getItemsPrice(gameid, allourItems, function (data){
                debug(data);
                debug("Loaded Market Prices for us");
                for (let i in allourItems)
                {
                  if (data[i] != undefined) 
                  {
                    let ourinputData = data[i].lowest_price;
                    let ourtostring = ourinputData.toString();
                    let ourcurrentData = ourtostring.slice(1, 5);
                    let ourparseData = parseFloat(ourcurrentData);
                    ourprice += ourparseData;
                    console.log("We offered ".green + data[i].name);
                  }
                  else
                  {
                    console.log('Someone tried to trade items from another game..');
                    debug("Someone tried to trade items from other games!");
                  }
                }
                console.log('Our Value: '.blue + ourprice);
                if (ourprice <= theirprice) 
                {
                  if (theirprice != 0 && ourprice != 0)
                  {
                    let profitprice = theirprice - ourprice;
                    acceptOffer(offer, profitprice).then(() => {
                      community.checkConfirmations();
                      sendStatus(ourprice, theirprice, profitprice, partner);
                      saveTrade(partner, offer.id, profitprice, allourItems, allitems);
                      resolve();
                    });
                  } 
                  else 
                  {
                    declineOffer(offer, "Theirprice and our Price are equal to 0");
                    resolve();
                  }
                }
                else 
                {
                  declineOffer(offer, "We are overpaying, ourprice <= theirprice");
                  resolve();
                }
              });
            }
          });
        } 
        else 
        {
          console.log('\n');
          console.log('================= New Trade ===================='.green);
          declineOffer(offer, "Allitems.length is not bigger than 0");
          resolve();
        }
      }
    });
  });
}
