import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const calculateTotalCost = () => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.pprice * item.quantity;
    });
    setTotalCost(total);
  };

  const handleBuy = async () => {
    try {
      // Aggregate total price for each product ID
      const totalPriceMap = {};
      cartItems.forEach(item => {
        const totalPrice = item.pprice * item.quantity;
        if (totalPriceMap[item.product_id]) {
          totalPriceMap[item.product_id] += totalPrice;
        } else {
          totalPriceMap[item.product_id] = totalPrice;
        }
      });

      // Prepare transaction data
      const transactionData = {
        products: Object.keys(totalPriceMap).map(productId => ({
          product_id: parseInt(productId),
          quantity: 1, // Assuming each product occurs only once in the transaction
          price: totalPriceMap[productId]
        }))
      };

      // Send transaction data to the backend to store in the database
      const response = await axios.post('http://localhost:5000/api/transactions', transactionData);
      console.log(response.data.message); // Log success message
      // Clear the cart after successful transaction
      setCartItems([]);
      alert('Items bought successfully!'); // Display success message
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
      <p><strong>Total Cost:</strong> ₹{totalCost}</p>
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
};

export default CartPage;
