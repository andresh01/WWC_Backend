const fs = require("fs");
const path = require("path");

const http = require("http");
const express = require("express");
const { stringify } = require("querystring");
const { error } = require("console");

const PORT = 3000;

var app = express();
app.use(express.json());


const readFile = async () => {
    const filePath = path.resolve(`${__dirname}/products.txt`);
    const data = await fs.promises.readFile(filePath,'utf-8');
    const objProducts = JSON.parse(data);
    

    app.get("/api/v1/products", (req, res) => {
        res.send(objProducts.products)
    })

    app.get("/api/v1/products/:productId", (req, res) => {
        const { productId } = req.params;
        const idInt = parseInt(productId);
        let productIndex = objProducts.products.map((element) => element.id).indexOf(idInt);

        res.send(objProducts.products[productIndex])
        console.log(objProducts.products[productIndex]);
    })

    app.post("/api/v1/products", (req, res) => {
        const product = req.body;
        objProducts.products.push(product);
        res.json(objProducts);
        const productsString = JSON.stringify(objProducts); 
        
        const writeFile = async () => {
            const filePath = path.resolve(`${__dirname}/products.txt`);
            const data = await fs.promises.writeFile(filePath,productsString);  
        } 
        writeFile();
        
    })


    app.delete("/api/v1/products/:productId", (req, res) => {
        const { productId } = req.params;
        const idInt = parseInt(productId);

        let productIndex = objProducts.products.map((element) => element.id).indexOf(idInt);
       
        if (productIndex != -1) {
            objProducts.products.splice(productIndex,1); 
            res.json(objProducts);
            const productsString = JSON.stringify(objProducts); 
            console.log('Delete')

            const writeFile = async () => {
                const filePath = path.resolve(`${__dirname}/products.txt`);
                const data = await fs.promises.writeFile(filePath,productsString);  
            } 
            writeFile();

        } else {
            res.json("there is not")
            console.log('Product does not exist')}

    })

    app.patch("/api/v1/products/:productId", (req, res) => {
        const { productId } = req.params;
        const idInt = parseInt(productId);
        const productIndex = objProducts.products.map((element) => element.id).indexOf(idInt);
        const product = objProducts.products[productIndex];
        console.log("product: ",product);
        
        const productModification = req.body;
        console.log("producto modificado ",productModification);
        const arrayKeys = Object.keys(productModification);
        const arrayValues = Object.values(productModification);
        const { name } = arrayKeys;
        console.log();

        console.log(product.name);


        /* for (let i = 0; i < arrayKeys.length; i++) {
            product.arrayKeys[i] = arrayValues[i];
            
        }
            */ 

        res.json(objProducts.products[productIndex])

    })

}





app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`)
})

readFile();