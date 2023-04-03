const fs = require("fs");
const path = require("path");

const http = require("http");
const express = require("express");
const { stringify } = require("querystring");
const { error } = require("console");

const PORT = 3000;

var app = express();
app.use(express.json());


app.get("/api/v1/products", (req, res) => {
    readProducts(req,res);
})


app.get("/api/v1/products/:productId", (req, res) => {
    readProductsById(req,res);
})


app.post("/api/v1/products", (req, res) => {
    addProduct(req, res);
})


app.delete("/api/v1/products/:productId", (req, res) => {
    deleteProduct(req, res);
})

app.patch("/api/v1/products/:productId", (req, res) => {
    updateProduct(req,res);
})

// Read file .txt where is the products and it change from string to object /return a promise object
const readFile = async () => {
    const filePath = path.resolve(`${__dirname}/products.txt`);
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}


//Check if product exists or not / return -1 if the id doesnot exists
function productExist (objProducts, idInt){     
    let productIndex = objProducts.products.map((element) => element.id).indexOf(idInt);
    return productIndex;
}

function readProducts (req, res) {
    readFile().then((objProducts) => {
        res.send(objProducts.products)
    })
}

function readProductsById (req, res) {
    readFile().then((objProducts) => {
        const { productId } = req.params;
        const idInt = parseInt(productId);
        let productIndex = objProducts.products.map((element) => element.id).indexOf(idInt);
        
        res.send(objProducts.products[productIndex]);
    })
}

function addProduct (req, res){
    readFile().then((objProducts) => {
        
        const product = req.body;
        const idInt = parseInt(product.id);
        
        if (productExist(objProducts,idInt) == -1) {
            objProducts.products.push(product);
        res.json(objProducts);
        const productsString = JSON.stringify(objProducts);
        
        const writeFile = async () => {
            const filePath = path.resolve(`${__dirname}/products.txt`);
            const data = await fs.promises.writeFile(filePath, productsString);
        }
        writeFile();
        } else {
            res.json("Product already exist");
        }
        
    })
}

function deleteProduct (req, res) {
    readFile().then((objProducts) => {
       
        const { productId } = req.params;
        const idInt = parseInt(productId);
        
        if (productExist(objProducts,idInt) != -1) {
            objProducts.products.splice(productIndex, 1);
            res.json(objProducts);
            const productsString = JSON.stringify(objProducts)
            
            const writeFile = async () => {
                const filePath = path.resolve(`${__dirname}/products.txt`);
                const data = await fs.promises.writeFile(filePath, productsString);
            } 
            writeFile();
            
        } else {
            res.json("Product does not exist")
            console.log('Product does not exist')
        }
        
    })
}

function updateProduct (req, res) {
    const { productId } = req.params;
    const idInt = parseInt(productId);
    const productIndex = objProducts.products.map((element) => element.id).indexOf(idInt);
    const product = objProducts.products[productIndex];
    console.log("product: ", product);

    const productModification = req.body;
    console.log("producto modificado ", productModification);
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
}

app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`)
})
