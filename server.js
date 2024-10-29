const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const addressRoutes = require('./routes/AddressRoute');
// const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);

app.use('/api/addresses', addressRoutes);

app.use('/api/payment', paymentRoutes);


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
