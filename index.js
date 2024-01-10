import express from 'express';
import request from 'request';
import cors from "cors";
import dotenv from 'dotenv'
import bodyParser from 'body-parser';

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

let url = "https://s3.amazonaws.com/open-to-cors/assignment.json";

let options = {json: true};


app.get('/', (req, resp) => {
    
    request(url, options, (error, res, body) => {
        if (error) {
            return  console.log(error)
        };
    
        if (!error && res.statusCode == 200) {

            const productsArray = [];

            if (res.body && res.body.products) {
                const productsObject = res.body.products;

                for (const key in productsObject) {
                    if (Object.prototype.hasOwnProperty.call(productsObject, key)) {
                        const product = productsObject[key];
                                        
                        // Extract title and price from each product object
                        const { title, price, popularity } = product;
                        
                        // Check if both title and price exist before pushing to the array
                        if (title && price && popularity) {
                            productsArray.push({ Title: title, Price: price, Popularity: popularity });
                        }
                    }
                }
            }

            const sortedProducts = productsArray.sort((a, b) => b.Popularity - a.Popularity);

            // Extract Title and Price of products
            const formattedProducts = sortedProducts.map(product => {
            return {
                Title: product.Title,
                Price: product.Price,
                Popularity: product.Popularity
            };
            });

            let htmlContent = '<!DOCTYPE html><html><head><title>Product List</title>';
            htmlContent += '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">';
            htmlContent += '</head><body>';
            
            // Bootstrap Navbar with Logo Image
            htmlContent += '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">';
            htmlContent += '<a class="navbar-brand" href="#"><img src="smartserv-logo.png" alt="Logo" class="img-fluid"></a>';
            htmlContent += '</nav>';
            
            // Bootstrap Container and Table
            htmlContent += '<div class="container mt-4">';
            htmlContent += '<h1>Products</h1>';
            htmlContent += '<table class="table table-bordered">';
            htmlContent += '<thead class="thead-dark"><tr><th scope="col">Title</th><th scope="col">Price</th><th scope="col">Popularity</th></tr></thead>';
            htmlContent += '<tbody>';

            // Inserting product data into table rows
            formattedProducts.forEach(product => {
                htmlContent += `<tr><td>${product.Title}</td><td>${product.Price}</td><td>${product.Popularity}</td></tr>`;
            });

            htmlContent += '</tbody></table></div></body></html>';
      
            // Send HTML content as response
            resp.send(htmlContent);


        };
    });
});


app.listen(3001, () => {
    console.log(`Server is running on port 3001`);
});


