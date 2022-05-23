

module.exports = {
    randNumb: (text) => {
        let str = text+"-";
        for(let x = 0; x < 5; x++){
            str += Math.floor(Math.random() * 10);
        }
        return str;
    }
}