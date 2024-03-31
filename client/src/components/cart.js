import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [transactionReceipt, setTransactionReceipt] = useState(null);
  const [transactionTotalCost, setTransactionTotalCost] = useState(0); // Variable to store total cost for the transaction
  const { bId } = useParams();

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [cartItems]);

  useEffect(() => {
    // Clear cart items when the component mounts
    setCartItems([]);
  }, [bId]);

  const fetchCartItems = async () => {
    try {
      if (cartItems.length === 0) {
        const response = await axios.get('http://localhost:5000/api/cart');
        setCartItems(response.data);
      }
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
      const totalPriceMap = {};
      let transactionTotal = 0; // Variable to store total cost for this transaction

      cartItems.forEach(item => {
        const totalPrice = item.pprice * item.quantity;
        transactionTotal += totalPrice; // Accumulate total cost for this transaction
        if (totalPriceMap[item.product_id]) {
          totalPriceMap[item.product_id] += totalPrice;
        } else {
          totalPriceMap[item.product_id] = totalPrice;
        }
      });

      const transactionData = {
        products: Object.keys(totalPriceMap).map(productId => ({
          product_id: parseInt(productId),
          quantity: 1,
          price: totalPriceMap[productId],
          buyer_id: bId,
        }))
      };

      const response = await axios.post('http://localhost:5000/api/transactions', transactionData);
      console.log(response.data);

      setTransactionReceipt(response.data);
      setTransactionTotalCost(transactionTotal); // Store total cost for this transaction

      setCartItems([]);
      alert('Items bought successfully!');
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
      {totalCost > 0 && <p><strong>Total Cost:</strong> ₹{totalCost}</p>}

      {cartItems.length > 0 && <button onClick={handleBuy}>Buy</button>}
      {transactionReceipt && (
        <div className="receipt" style={{marginLeft:25}}>
          <h2>Transaction Receipt</h2>
          <p><strong>Transaction ID:</strong> {transactionReceipt.transactionId}</p>
          <h3>Products:</h3>
          <ul>
            {transactionReceipt.products.map(product => (
              <li key={product.product_id}>
                <p><strong>Name:</strong> {product.pname}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Price:</strong> ₹{product.pprice}</p>
              </li>
            ))}
          </ul>
          <p><strong>Total Price:</strong> ₹{transactionTotalCost}</p> {/* Use transactionTotalCost here */}
        </div>
      )}
    </div>
  );
};

export default CartPage;
