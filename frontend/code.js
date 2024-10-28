// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const apiSlice = createApi({
//     reducerPath: 'api',
//     baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }), // Update to your backend URL
//     endpoints: (builder) => ({
//         getAllProducts: builder.query({
//             query: () => '/products',
//         }),
//         addToCart: builder.mutation({
//             query: ({ userId, productId, quantity }) => ({
//                 url: '/cart/add',
//                 method: 'POST',
//                 body: { userId, productId, quantity },
//             }),
//         }),
//         getCart: builder.query({
//             query: (userId) => `/cart/${userId}`,
//         }),
//     }),
// });

// export const { useGetAllProductsQuery, useAddToCartMutation, useGetCartQuery } = apiSlice;

// // product

// import React from 'react';
// import { useGetAllProductsQuery } from './features/api/apiSlice';

// const ProductsList = () => {
//     const { data: products, error, isLoading } = useGetAllProductsQuery();

//     if (isLoading) return <p>Loading...</p>;
//     if (error) return <p>Error loading products</p>;

//     return (
//         <div>
//             <h2>Products</h2>
//             {products.map((product) => (
//                 <div key={product._id}>
//                     <h3>{product.name}</h3>
//                     <p>{product.description}</p>
//                     <p>Price: ${product.price}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ProductsList;


// //cart

// import React, { useState } from 'react';
// import { useAddToCartMutation } from './features/api/apiSlice';

// const AddToCartButton = ({ productId, userId }) => {
//     const [quantity, setQuantity] = useState(1);
//     const [addToCart] = useAddToCartMutation();

//     const handleAddToCart = async () => {
//         try {
//             await addToCart({ userId, productId, quantity }).unwrap();
//             alert('Item added to cart');
//         } catch (error) {
//             console.error('Failed to add item:', error);
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="number"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Number(e.target.value))}
//             />
//             <button onClick={handleAddToCart}>Add to Cart</button>
//         </div>
//     );
// };

// export default AddToCartButton;


// //cart view

// import React from 'react';
// import { useGetCartQuery } from './features/api/apiSlice';

// const Cart = ({ userId }) => {
//     const { data: cart, error, isLoading } = useGetCartQuery(userId);

//     if (isLoading) return <p>Loading cart...</p>;
//     if (error) return <p>Error loading cart</p>;

//     return (
//         <div>
//             <h2>Cart</h2>
//             {cart?.items?.map((item) => (
//                 <div key={item.productId._id}>
//                     <h3>{item.productId.name}</h3>
//                     <p>Price: ${item.productId.price}</p>
//                     <p>Quantity: {item.quantity}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Cart;


// // Add to card button

// // Inside your ProductsList component
// {products.map((product) => (
//     <div key={product._id}>
//         <h3>{product.name}</h3>
//         <p>{product.description}</p>
//         <p>Price: ${product.price}</p>
//         <AddToCartButton productId={product._id} userId={yourUserId} />
//     </div>
// ))}
