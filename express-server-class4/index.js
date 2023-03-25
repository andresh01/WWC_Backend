const express = require("express");

const PORT = 3000;

const app = express();

app.use(express.json()); //esta linea es para configurar toda la pagina para que podamos recibir json 

const errorLogger = (err, req, res, next) => {
    console.log(err);
    next(err);
};
const errorHandler = (err, req, res) => {
    res.status(400).json({
        messaje: err.messaje,
    })
}


const products = [
    {
        id: 1,
        name: "Reloj",
        price: 100,
        quantity: 2
    },
    {
        id: 2,
        name: "Correa",
        price: 100,
        quantity: 3
    },
    {
        id: 3,
        name: "Sombrero",
        price: 1000,
        quantity: 3
    }
]

app.get("/", (req, res) => {
    res.send("Esta es mi primera app en express");
})

app.get("/api/v1/products", (req, res, next)  => {
    console.log("hola");
    next();
    res.json(products);
},
(req, res) => {
    res.json(products);
})

app.get("/api/v1/products/:productId", (req, res)  => {
    const { productId } = req.params; //destructuring
    console.log(req.params);
    const productIdInt = parseInt(productId);
    const product = products.find((product) => product.id === productIdInt )
    res.json(product);
})

app.post("/api/v1/products", (req, res) => {
    const product = req.body;
    products.push(product);
    res.json(products)
})

app.delete("/api/v1/products/:productId", (req, res) => {
    const { productId } = req.params;
    const productIdInt = parseInt(productId);
    console.log(productIdInt);
    const indexProduct = products.findIndex((product)=> product.id === productIdInt);
    if (indexProduct != -1) {
       const product = products.splice(indexProduct,1);
    }
    res.json(products);
})

app.listen(PORT, () => {
    console.log(`Escuchando en http://localhost:${PORT}`)
})