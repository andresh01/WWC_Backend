const http = require("http");

const HOST = "localhost";
const PORT = 8000;

const writeHTMLResponse = (res, htmlCode) => {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(htmlCode);
}

const writeJSONResponse = (res, json) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(json));
}

const products = [
    {
        name: "Reloj",
        price: 100,
        quantity: 2
    },
    {
        name: "Correa",
        price: 100,
        quantity: 3
    },
    {
        name: "Sombrero",
        price: 1000,
        quantity: 3
    }
]

const server = http.createServer(async(req, res) => {
    const url = req.url;
    let body = "";
    console.log("URL es ", url);

    await req.on("data", (chunk) =>{
        body += chunk;
    } )

    if (url === "/other") {
        writeHTMLResponse(res, "<p>Esto es otra ruta </p>")
    } else if("/api/v1/products/") {
        const method = req.method;
        console.log("Method", method);

        if (method === 'GET') {
            //Do Something
            writeJSONResponse(res, products);
        } else if(method === 'POST'){
            const product = JSON.parse(body);
            products.push(product);
            writeJSONResponse(res, products);

        } else if(method === 'DELETE') {
            const productInformation = JSON.parse(body);
            const productName = productInformation.name;

            if (productName) {
                const indexOfProduct = products.findIndex(
                    (product) => product.name === productName
                );
                console.log("indexOfProduct", indexOfProduct);
                if (indexOfProduct !== -1) {
                    products.splice(indexOfProduct, 1);
                }
            }
            writeJSONResponse(res, products);
        }
    }
    else {
        writeHTMLResponse(res, "<p> codigo HTML </p>")
    }
})

server.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
})