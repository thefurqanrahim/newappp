const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    quantity: Number,
});

module.exports = mongoose.model('Product', productSchema);







// const mongoose = require('mongoose');

// const variantSchema = new mongoose.Schema({
//     color: { type: String, required: true },
//     size: { type: String, required: true }, // You can add more fields as needed
//     quantity: { type: Number, required: true }, // Quantity for this specific variant
// });

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String, required: true },
//     imageUrl: { type: String, required: true },
//     variants: [variantSchema], // Array of variants
// });

// module.exports = mongoose.model('Product', productSchema);
