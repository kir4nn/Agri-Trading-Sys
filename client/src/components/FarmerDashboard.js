import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import ProductList from './ProductList'; // Assuming ProductList component is correctly implemented
import Notifications from './Notifications';
import axios from 'axios';
import '../App.css';

const FarmerDashboard = () => {
    const [productName, setProductName] = useState('');
    const [productQuality, setProductQuality] = useState('');
    const [productQuantity, setProductQuantity] = useState(''); // Removed default value of 0
    const [productPrice, setProductPrice] = useState('');
    const [productDomain, setProductDomain] = useState('');
    const [farmerId, setFarmerId] = useState('');
    const [products, setProducts] = useState([]);
  
    const [confirmationMessage, setConfirmationMessage] = useState('');

    useEffect(() => {
        fetchProducts(); // Fetch products when component mounts
    }, []);

    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
    };

    const handleProductQualityChange = (event) => {
        setProductQuality(event.target.value);
    };

    const handleProductQuantityChange = (event) => {
        const value = event.target.value;
        if (/^\d+$/.test(value) || value === '') { // Allow only positive integers or empty string
            setProductQuantity(value);
        }
    };

    const handleProductPriceChange = (event) => {
        const value = event.target.value;
        if (/^\d+$/.test(value) || value === '') { // Allow only positive integers or empty string
            setProductPrice(value);
        }
    };

    const handleProductDomainChange = (event) => {
        setProductDomain(event.target.value);
    };

    const handleFarmerIdChange = (event) => {
        const value = event.target.value;
        if (/^\d+$/.test(value) || value === '') { // Allow only positive integers or empty string
            setFarmerId(value);
        }
    };

    const handleEnlistProduct = async () => {
        try {
            await axios.post('/api/products', {
                pname: productName,
                pquality: productQuality,
                pquantity: productQuantity,
                pprice: productPrice,
                pdomain: productDomain,
                farmer_id: farmerId
            });
            fetchProducts(); // Fetch updated products after adding
            resetForm(); // Reset form fields
            setConfirmationMessage('Product enlisted successfully.'); // Set confirmation message
        } catch (error) {
            console.error('Error enlisting product:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const resetForm = () => {
        setProductName('');
        setProductQuality('');
        setProductQuantity('');
        setProductPrice('');
        setProductDomain('');
        setFarmerId('');
    };

    return (
        <div className="farmer-dashboard">
            <Navigation />
            <div className="dashboard-content">
                <h1>Welcome to Farmer's Dashboard</h1>
                <div className="dashboard-section">
                    <h2>Enlist Product</h2>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={handleProductNameChange}
                        style={{ marginBottom: '10px', display: 'block' }}
                    />
                    <select
                        value={productQuality}
                        onChange={handleProductQualityChange}
                        style={{ marginBottom: '10px', display: 'block' }}
                    >
                        <option value="">Select Product Quality</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Product Quantity"
                        value={productQuantity}
                        onChange={handleProductQuantityChange}
                        onKeyPress={(event) => {
                            if (!/\d/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        style={{ marginBottom: '10px', display: 'block' }}
                    />
                    <input
                        type="text"
                        placeholder="Product Price"
                        value={productPrice}
                        onChange={handleProductPriceChange}
                        onKeyPress={(event) => {
                            if (!/\d/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        style={{ marginBottom: '10px', display: 'block' }}
                    />
                    <select
                        value={productDomain}
                        onChange={handleProductDomainChange}
                        style={{ marginBottom: '10px', display: 'block' }}
                    >
                        <option value="">Select Product Domain</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Grains">Grains</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Farmer ID"
                        value={farmerId}
                        onChange={handleFarmerIdChange}
                        onKeyPress={(event) => {
                            if (!/\d/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        style={{ marginBottom: '10px', display: 'block' }}
                    />
                    <button onClick={handleEnlistProduct}>Enlist Product</button>
                    {confirmationMessage && <p>{confirmationMessage}</p>}
                </div>

                <div className="dashboard-section">
                    <h2>Your Products</h2>
                    <ProductList products={products} loggedInFarmerId={farmerId} /> {/* Pass products to ProductList component */}
                </div>

                <div className="dashboard-section">
                    <h2>Notifications</h2>
                    <Notifications />
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
