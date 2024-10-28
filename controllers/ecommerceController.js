const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createProduct = async (req, res) => {
    const { name, price, description, imageUrl, quantity } = req.body;
    console.log('Request Body:', req.body);
    try {
        const newProduct = new Product({
            name,
            price,
            description,
            imageUrl,
            quantity
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
};

exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Find the product to check available quantity
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if there is enough quantity in stock
        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity in stock' });
        }

        // Update the product quantity
        product.quantity -= quantity;
        await product.save();

        // Find or create a cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            // Check if the item is already in the cart
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex > -1) {
                // Update the quantity if item is already in cart
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item to the cart
                cart.items.push({ productId, quantity });
            }
        }

        // Save the updated cart
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};


exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId', 'name price');
    res.json(cart);
};

exports.createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
