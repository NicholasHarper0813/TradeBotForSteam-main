const fs = require('fs');
const debug = require('../debug');
module.exports = () => {
    fs.readdir('../../trades/', (err, files) => {
        if(err) debug(err);
        let accepted;
        let rejected;
        files.forEach((file, index) => {
            console.log(file);
        })
    })
}
