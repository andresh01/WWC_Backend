const fetch = require('node-fetch-commonjs');

const fetchApi = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        //realizar con el .map
        
        data.results.forEach(element => {
            console.log(element.id , element.name , element.gender);
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = fetchApi;