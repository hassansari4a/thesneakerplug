import express from 'express';
import expressAsyncHandler from 'express-async-handler'
import { isAdmin, isAuth } from '../utils.js';
import Product from '../models/productModel.js'
import data from "../data.js";

const productRouter = express.Router()

productRouter.get('/', expressAsyncHandler(async (req, res)=> {
    const products = await Product.find({})
    res.send(products)
}))

productRouter.get('/seed', expressAsyncHandler( async(req, res) => {
    const createdProducts = await Product.insertMany(data.products)
    res.set({createdProducts})
}))

productRouter.get('/:id', expressAsyncHandler(async (req, res)=> {
    const product =  await Product.findById(req.params.id)
    if (product) {
        res.send(product)
    }else {
        res.status(404).send({message: 'Product not found.'})
    }
}))
productRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = new Product({
            name: 'sample name ' + Date.now(),
            image: '/images/p1.jpg',
            price: 0,
            category: 'sample category',
            brand: 'sample brand',
            rating: 4.5,
            description: 'sample description',
        });
        const createdProduct = await product.save();
        res.send({ message: 'Product Created', product: createdProduct });
    })
);
productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.price = req.body.price;
            product.image = req.body.image;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.rating = req.body.rating;
            product.description = req.body.description;
            const updatedProduct = await product.save();
            res.send({ message: 'Product Updated', product: updatedProduct });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            const deleteProduct = await product.remove();
            res.send({ message: 'Product Deleted', product: deleteProduct });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

export default productRouter