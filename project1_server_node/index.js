
const fs = require("fs");
const path = require("path");

const http = require("http");
const express = require("express");
const { stringify } = require("querystring");
const { v4: uuidv4 } = require("uuid");

const { errors, errorHandler } = require("./middlewares/error.handler");
const { createProductValidation, updateProductValidation, getProductValidation, deleteProductValidation } = require("./validation/products.validation");
const validatorHandler = require("./middlewares/validator.handler");

const PORT = 3000;

var app = express();
app.use(express.json());



app.get("/api/v1/products", (req, res, next) => {
    try {
        readProducts(req, res, next);
    } catch (error) {
        next(error);
    }    
})


app.get("/api/v1/products/:id", 
    validatorHandler(getProductValidation, 'params'),
    (req, res, next) => {
        try {
            readProductsById(req, res);  
        } catch (error) {
            next(error);
        }    
    }
)


app.post("/api/v1/products",
    validatorHandler(createProductValidation, 'body'), 
    (req, res, next) => {
    try {
        addProduct(req, res, next);
    } catch (error) {
        next(error);
    }
})


app.delete("/api/v1/products/:id", 
    validatorHandler(deleteProductValidation, "params"),
    (req, res, next) => {
        try {
            deleteProduct(req, res, next);
        } catch (error) {
            next(error);
        }
    }
)


app.patch("/api/v1/products/:id", 
    validatorHandler(getProductValidation, "params"), 
    validatorHandler(updateProductValidation, "body"),
    (req, res, next) => {
        try {
            updateProduct(req, res, next);
        } catch (error) {
            next(error);
        }
    }
)



// Read file .txt where is the products and it change from string to object /return a promise object
const readFile = async (req, res, next) => {
    try {
        const filePath = path.resolve(`${__dirname}/products.txt`); //return a string with absolute path 
        const data = await fs.promises.readFile(filePath, 'utf-8'); //it reads the content in path filePath and display it in utf-8 format
        return JSON.parse(data) //change format from string to object
    } catch (error) {
        console.error(error);
        next(error);
       
    } 
}

// Write in file .txt the content of variable productsString passed like parameter
const writeFile = async (productsString, next) => {
    try {
        const filePath = path.resolve(`${__dirname}/products.txt`);
        const data = await fs.promises.writeFile(filePath, productsString); //it writes the content poductsString in path filePath
    } catch (error) {
        console.error(error);
        next(error);
    }
}


//Check if product exists or not / return -1 if the id does not exists
//or return position of object in array
function productExist(objProducts, idInt) {
    let productIndex = objProducts.products.map((element) => element.id).indexOf(idInt);
    return productIndex;
}



//get object objProducts  
function readProducts(req, res, next) {
     readFile(req, res, next).then((objProducts) => { 
        res.status(200).json(objProducts.products) //Display Object
    })
}

function readProductsById(req, res) {
    readFile().then((objProducts) => {
        const { id } = req.params; //destructuring
        let productIndex = productExist(objProducts, id); //if exist, save the position of object else save -1

        if (productIndex != -1) {
            res.status(200).json(objProducts.products[productIndex])
        } else {
            res.status(404).json({
                message: "Product doesn't exist"
            })
        }
    })
}

function addProduct(req, res, next) {
    readFile().then((objProducts) => {
        const product = req.body;
        const id = {id:uuidv4()};
        const newProduct = {...id, ...product};

        if (productExist(objProducts, id) == -1) {
            objProducts.products.push(newProduct);
            
            const productsString = JSON.stringify(objProducts);
            writeFile(productsString, next);
            
            res.status(201).json({
                messaje: 'Created',
                data: newProduct
            });
            

        } else {
            res.status(404).json({
                message: "Id already exist"
            });
        }
    })
}

function deleteProduct(req, res, next) {
    readFile().then((objProducts) => {
        const { id } = req.params;
        let productIndex = productExist(objProducts, id)
        var nameProductDelete = objProducts.products[productIndex].name;

        if (productIndex != -1) { 
            
            objProducts.products.splice(productIndex, 1);
            const productsString = JSON.stringify(objProducts)

            writeFile(productsString, next);
            res.status(200).json({
                message: `Product ${nameProductDelete} was delete`
            });

        } else {
            res.status(404).json({
                message: "Product does not exist"
            })
        }
    })
}

function updateProduct(req, res) {

    readFile().then((objProducts) => {
        const { id } = req.params;
        
        const updateProduct = req.body;
        const indexProduct = productExist(objProducts, id)

        if (indexProduct != -1) {
            const product = objProducts.products[indexProduct];
            
            objProducts.products[indexProduct]= {
                ...product,
                
                ...updateProduct
            }
            res.json(objProducts.products[indexProduct]);

            const productsString = JSON.stringify(objProducts);

            writeFile(productsString);

        } else {
            res.status(401).json({
                message: "Product does not exists"
            })
        }
    })
}

app.use(errors);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`)
})
