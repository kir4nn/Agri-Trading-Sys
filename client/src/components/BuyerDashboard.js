
import React, { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import shoppingCartIcon from '../images/shopping-cart-outline-svgrepo-com.svg';
import CartPage from './cart'; // Import CartPage component

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product.product_id,
        quantity: product.pquantity // You can adjust the quantity as needed
      });
      console.log(response.data.message);
      // navigateTo('/cart'); // Utilize the custom navigation function
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const navigateTo = (path) => {
    window.location.href = path; // Use window.location.href to redirect
  };

  return (
    <div className="buyer-dashboard">
      <div className="shopping-cart-wrapper">
        <Link to="/cart" className="shopping-cart-link">
          <img src={shoppingCartIcon} alt="Shopping Cart" className="shopping-cart-icon" />
        </Link>
      </div>
      <h1>Buyer Dashboard</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.product_id} className="product-card">
            <h3>{product.pname}</h3>
            <p><strong>Quality:</strong> {product.pquality}</p>
            <p><strong>Quantity:</strong> {product.pquantity}</p>
            <p><strong>Price:</strong> ₹{product.pprice}</p>
            <p><strong>Domain:</strong> {product.pdomain}</p>
            <p><strong>Farmer ID:</strong> {product.farmer_id}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      { }
    </div>
  );
}

export default BuyerDashboard;
