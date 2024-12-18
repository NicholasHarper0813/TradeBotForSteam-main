module.exports = (status, profit) => {
    if(status === true)
    {
        console.log('Accepted with profit: '.green + profit);
    } 
    else 
    {
        console.log('Declined the offer.'.red);
    }
}
