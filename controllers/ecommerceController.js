const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Address = require('../models/AdressModel')
const Payment = require('../models/PaymentModel');

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
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity in stock' });
        }

        product.quantity -= quantity;
        await product.save();

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

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

exports.addAddress = async (req, res) => {
    const { userId, street, city, state, zipCode, country, phoneNumber, additionalInfo } = req.body;

    if (!userId || !street || !city || !state || !zipCode || !country) return res.status(400).json({ message: 'Missing required fields' });

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid userId' });
    
    try {
        const newAddress = new Address({ userId, street, city, state, zipCode, country, phoneNumber, additionalInfo });
        await newAddress.save();
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ message: 'Error adding address', error });
    }
};

exports.getUserAddresses = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid userId' });

    try {
        const addresses = await Address.find({ userId });
        if (addresses.length === 0) return res.status(404).json({ message: 'No addresses found' });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error });
    }
};

exports.updateAddress = async (req, res) => {
    const { addressId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(addressId)) return res.status(400).json({ message: 'Invalid addressId' });

    try {
        const updatedAddress = await Address.findByIdAndUpdate(addressId, updateData, { new: true, runValidators: true });
        if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });
        res.json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error });
    }
};

exports.deleteAddress = async (req, res) => {
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) return res.status(400).json({ message: 'Invalid addressId' });

    try {
        const deletedAddress = await Address.findByIdAndDelete(addressId);
        if (!deletedAddress) return res.status(404).json({ message: 'Address not found' });
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting address', error });
    }
};


exports.createPaymentIntent = async (req, res) => {
    const { userId, amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency || 'usd'
        });

        const payment = new Payment({
            userId,
            amount,
            currency: currency || 'usd',
            paymentStatus: 'pending',
            clientSecret: paymentIntent.client_secret
        });

        await payment.save();

        res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Payment processing failed', error });
    }
};

exports.getPaymentDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const payments = await Payment.find({ userId });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payment details', error });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    const { paymentId, status } = req.body;

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            { paymentStatus: status },
            { new: true }
        );
        if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status', error });
    }
};






// const Cart = require('../models/Cart');
// const Product = require('../models/Product');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// exports.createProduct = async (req, res) => {
//     const { name, price, description, imageUrl, variants } = req.body; // Include variants
//     console.log('Request Body:', req.body);
//     try {
//         const newProduct = new Product({
//             name,
//             price,
//             description,
//             imageUrl,
//             variants // Save the variants
//         });

//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(400).json({ message: 'Error creating product', error });
//     }
// };

// exports.getAllProducts = async (req, res) => {
//     const products = await Product.find();
//     res.json(products);
// };

// exports.addToCart = async (req, res) => {
//     const { userId, productId, variantIndex, quantity } = req.body; // Added variantIndex to identify the variant

//     try {
//         // Find the product to check available quantity
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         // Check if the variant index is valid
//         if (variantIndex < 0 || variantIndex >= product.variants.length) {
//             return res.status(400).json({ message: 'Invalid variant' });
//         }

//         // Check if there is enough quantity in stock for the specific variant
//         const variant = product.variants[variantIndex];
//         if (variant.quantity < quantity) {
//             return res.status(400).json({ message: 'Insufficient quantity in stock for this variant' });
//         }

//         // Update the variant quantity
//         variant.quantity -= quantity;
//         await product.save();

//         // Find or create a cart for the user
//         let cart = await Cart.findOne({ userId });
//         if (!cart) {
//             cart = new Cart({ userId, items: [{ productId, variantIndex, quantity }] });
//         } else {
//             // Check if the item is already in the cart
//             const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId && item.variantIndex === variantIndex);
//             if (itemIndex > -1) {
//                 // Update the quantity if item is already in cart
//                 cart.items[itemIndex].quantity += quantity;
//             } else {
//                 // Add new item to the cart
//                 cart.items.push({ productId, variantIndex, quantity });
//             }
//         }

//         // Save the updated cart
//         await cart.save();
//         res.json(cart);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error adding to cart', error });
//     }
// };

// exports.getCart = async (req, res) => {
//     const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId', 'name price imageUrl variants');
//     res.json(cart);
// };

// exports.createPaymentIntent = async (req, res) => {
//     const { amount } = req.body;
//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100,
//             currency: 'usd',
//         });
//         res.send({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         res.status(400).send({ error: error.message });
//     }
// };
