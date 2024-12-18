let fs = require('fs');
let array = require('../config.json');

module.exports.confighandler = function confighandler (label, data) 
{
    console.log(label + ' changed to: ' + data);
    array[label] = data;
    let json = JSON.stringify(array);
    fs.writeFile('config.json', json, 'utf8', (err) => {
        if(err) throw err;
        return;
    }); 
}
