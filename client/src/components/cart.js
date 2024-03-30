import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // const navigateTo = (path) => {
  //   window.location.href = path; // Use window.location.href to redirect
  // };

  const handleBuy = async () => {
    try {
      // Calculate total price and quantity
      let totalPrice = 0;
      let totalQuantity = 0;
      cartItems.forEach(item => {
        totalPrice += item.pprice * item.quantity;
        totalQuantity += item.quantity;
      });

      // Prepare transaction data
      const transactionData = {
        price: totalPrice,
        trans_date: new Date().toISOString().slice(0, 10), // Current date
        quantity: totalQuantity,
        products: cartItems.map(item => item.productId) // Array of product ids
        // You may also need to include buyer_id if you have a logged-in user system
      };

      // Send transaction data to the backend to store in the database
      const response = await axios.post('http://localhost:5000/api/transactions', transactionData);
      console.log(response.data.message); // Log success message
      // Clear the cart after successful transaction
       // Redirect to homepage
      setCartItems([]);
      window.location.href = '/';
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  };

  return (
    <div>
      <h1>Cart</h1>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.productId} className="cart-item">
            <h3>{item.pname}</h3>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ₹{item.pprice}</p>
          </div>
        ))}
      </div>
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
};

export default CartPage;
