const express = require('express');
const productRouter = express.Router();
const jwt = require('jsonwebtoken');
const productController = require('../controllers/ProductControllers');
const authController = require('../controllers/authControllers.js');

//Product Routers:

//Get All Products:
//GET Request
productRouter.get(
  '/',
  authController.retrieveToken,
  authController.verifyToken,
  productController.getProducts,

  (req, res) => {
    res.status(200).json({ products: res.locals.products });
  }
);

//Get one Product:
productRouter.get(
  '/:id', 
  authController.retrieveToken,
  authController.verifyToken,
  productController.getOneProduct,
  (req, res) => {
    res.status(200).json({ product: res.locals.product })
  }
)

//Add One Product:
//POST Request
productRouter.post(
  '/',
  authController.retrieveToken,
  authController.verifyToken,
  productController.addProduct,
  (req, res) => {
    res.status(200).json({ product: res.locals.product, message: "Product Added to Favorites!" });
  }
);

//Delete One Product:
//DELETE Request
productRouter.delete(
  '/:id',
  authController.retrieveToken,
  authController.verifyToken,
  productController.deleteProduct,
  (req, res) => {
    res.status(200).json({message: 'Deleted Product'});
  }
);

productRouter.put(
  '/:id',
  authController.retrieveToken,
  authController.verifyToken,
  productController.editProduct,
  (req, res) => {
    res.status(200).json({
      message: 'Product Updated',
      email_preference: res.locals.email_preference,
      desired_price: res.locals.desired_price
    });
  }
);

module.exports = productRouter;
