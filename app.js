var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
app.set("view engine", 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/webdxd');

var productSchema = {
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    stock: Number,
    onSale: Boolean
};

var productModel = mongoose.model('Product', productSchema, 'product');

//Get all product list
app.get('/products', function (req, res) {
    productModel.find().exec(function (err, doc) {
        if (err) {
            res.send("{\"result\":\"error\"}");
        } else {
            res.send(doc);
        }
    });
});

//Get single product
app.get('/products/:id', function (req, res) {
    productModel.findById(req.params.id, function (err, doc) {
        if (err) {
            res.send("{\"result\":\"error\"}");
        } else {
            res.send(doc);
        }
    });
});

//Create new product
app.post('/products', function (req, res) {
    console.log(req);
    var productObject = new productModel(req.body);
    productObject.save();
    res.send("{\"result\":\"success\"}");
});

//Update product by Id
app.post('/products/update/:id', function (req, res) {
    productModel.update({ _id: req.params.id }, { $set: req.body }, function (err, doc) {
        if (err) {
            res.send("{\"result\":\"error\"}");
        } else {
            res.send("{\"result\":\"success\"}");
        }
    });
});

//Delete product by Id
app.get('/products/delete/:id', function (req, res) {
    productModel.findById(req.params.id).remove(function (err, doc) {
        if (err) {
            res.send("{\"result\":\"error\"}");
        } else {
            res.send("{\"result\":\"success\"}");
        }
    });
});

app.get('/products/buy/:id', function (req, res) {
    productModel.findById(req.params.id, function (err, doc) {
        if (err) {
            res.send("{\"result\":\"error\"}");
        } else {
            if (doc.stock <= 0) {
                res.send("{\"result\":\"sold out\"}");
            }
            else {
                var newStock = doc.stock - 1;
                productModel.update({ _id: req.params.id }, { stock: newStock }, function (err, updateResult) {
                    if (err) {
                        res.send("{\"result\":\"error\"}");
                    } else {
                        doc.stock = newStock;
                        res.send(doc);
                    }
                });
            }
        }
    });
});

app.listen(3000, function () {
    console.log('Product API listening on port 3000!')
});