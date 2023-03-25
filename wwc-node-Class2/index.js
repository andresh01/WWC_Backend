/* console.log('Hola mundo');
console.log('Hola 2'); */

const fs = require('fs');
const path = require('path');

/* __dirname;
__filename */
/* 
var content = 'texto en el archivo\n';
var textadd = 'texto añadido';

const readFile = async () => {
    try {
        const filePath = path.resolve(`${__dirname}/archivo.txt`);
        const data = await fs.promises.readFile(filePath,'utf-8');
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}



const writeFile = async () => {
    try {
        const filePath = path.resolve(`${__dirname}/archivo.txt`);
        const texto = await fs.promises.writeFile(filePath,content);
        console.log(texto);
    } catch (error) {
        console.log(error);
    }
}

const addFile = async () => {
    try {
        const filePath = path.resolve(`${__dirname}/archivo.txt`);
        const texto = await fs.promises.appendFile(filePath, textadd);
        console.log(texto);
    } catch (error) {
        console.log(error);
    }
}


writeFile();

addFile();

readFile(); */

const fetchApi = require('./src/utils/api');

fetchApi("https://rickandmortyapi.com/api/character");