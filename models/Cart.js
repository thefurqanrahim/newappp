const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
        },
    ],
});

module.exports = mongoose.model('Cart', cartSchema);


// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     items: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//             variantIndex: { type: Number, required: true }, // Added variantIndex to keep track of which variant is in the cart
//             quantity: { type: Number, required: true },
//         },
//     ],
// });

// module.exports = mongoose.model('Cart', cartSchema);
