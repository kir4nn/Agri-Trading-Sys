import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import ProductList from './ProductList';
import Notifications from './Notifications';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../App.css';
const FarmerDashboard = () => {
    const [productName, setProductName] = useState('');
    const [productQuality, setProductQuality] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDomain, setProductDomain] = useState('');
    const [farmerId, setFarmerId] = useState('');
    const [products, setProducts] = useState([]);
  
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        productName: '',
        productQuality: '',
        productQuantity: '',
        productPrice: '',
        productDomain: '',
        farmerId: ''
    });

    
    const [alertMessage, setAlertMessage] = useState('');
    
    const {fEmail}=useParams()
    
    useEffect(() => {
        fetchProducts();
        fetchFarmerId();
    }, []);

    const fetchFarmerId = async () => {
        try {
            const response = await axios.get(`/api/farmer-id?email=${fEmail}`);
            const farmerId = response.data[0].farmer_id;
            setFarmerId(farmerId);
        } catch (error) {
            console.error('Error fetching farmer ID:', error);
        }
    };

    const checkFormValidity = (name, quality, quantity, price, domain, farmerId) => {
        if (name && quality && quantity && price && domain && farmerId) {
            setIsFormValid(true);
            setAlertMessage('');
        } else {
            setIsFormValid(false);
            setAlertMessage('Please fill in all fields.');
        }
    };

    const handleProductNameChange = (event) => {
        const value = event.target.value;
        if (/^[A-Za-z]/.test(value) || value === '') {
            setProductName(value);
            setValidationErrors({ ...validationErrors, productName: '' });
        } else {
            setValidationErrors({ ...validationErrors, productName: 'Product Name is required and must start with an alphabet.' });
        }
        checkFormValidity(value, productQuality, productQuantity, productPrice, productDomain, farmerId);
    };

    const handleProductQualityChange = (event) => {
        const value = event.target.value;
        if (value) {
            setProductQuality(value);
            setValidationErrors({ ...validationErrors, productQuality: '' });
        } else {
            setValidationErrors({ ...validationErrors, productQuality: 'Product Quality is required.' });
        }
        checkFormValidity(productName, value, productQuantity, productPrice, productDomain, farmerId);
    };

    const handleProductQuantityChange = (event) => {
        const value = event.target.value;
        if (/^\d+$/.test(value) || value === '') {
            setProductQuantity(value);
            setValidationErrors({ ...validationErrors, productQuantity: '' });
        } else {
            setValidationErrors({ ...validationErrors, productQuantity: 'Product Quantity must be a positive integer.' });
        }
        checkFormValidity(productName, productQuality, value, productPrice, productDomain, farmerId);
    };

    const handleProductPriceChange = (event) => {
        const value = event.target.value;
        if (/^\d+$/.test(value) || value === '') {
            setProductPrice(value);
            setValidationErrors({ ...validationErrors, productPrice: '' });
        } else {
            setValidationErrors({ ...validationErrors, productPrice: 'Product Price must be a positive integer.' });
        }
        checkFormValidity(productName, productQuality, productQuantity, value, productDomain, farmerId);
    };

    const handleProductDomainChange = (event) => {
        const value = event.target.value;
        if (value) {
            setProductDomain(value);
            setValidationErrors({ ...validationErrors, productDomain: '' });
        } else {
            setValidationErrors({ ...validationErrors, productDomain: 'Product Domain is required.' });
        }
        checkFormValidity(productName, productQuality, productQuantity, productPrice, value, farmerId);
    };

    const handleFarmerIdChange = (event) => {
        const value = event.target.value;
        if (/^\d+$/.test(value) || value === '') {
            setFarmerId(value);
            setValidationErrors({ ...validationErrors, farmerId: '' });
        } else {
            setValidationErrors({ ...validationErrors, farmerId: 'Farmer ID must be a positive integer.' });
        }
        checkFormValidity(productName, productQuality, productQuantity, productPrice, productDomain, value);
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
            fetchProducts();
            resetForm();
            setConfirmationMessage('Product enlisted successfully.');
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
                    {alertMessage && <small style={{ color: 'red' }}>{alertMessage}</small>}
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={handleProductNameChange}
                        style={{ marginBottom: '10px', display: 'block' }}
                    />
                    {validationErrors.productName && <small style={{ color: 'red' }}>{validationErrors.productName}</small>}
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
                    {validationErrors.productQuality && <small style={{ color: 'red' }}>{validationErrors.productQuality}</small>}
                    <input
                        type="text"
                        placeholder="Product Quantity"
                        value={productQuantity}
                        onChange={handleProductQuantityChange}
                        style={{ marginBottom: '10px', display: 'block' }}
                    />
                    {validationErrors.productQuantity && <small style={{ color: 'red' }}>{validationErrors.productQuantity}</small>}
                    <input
                        type="text"
                        placeholder="Product Price"
                        value={productPrice}
                        onChange={handleProductPriceChange}
                        style={{ marginBottom: '10px', display: 'block' }}
                    />
                    {validationErrors.productPrice && <small style={{ color: 'red' }}>{validationErrors.productPrice}</small>}
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
                    {validationErrors.productDomain && <small style={{ color: 'red' }}>{validationErrors.productDomain}</small>}
                    <input
                        type="text"
                        placeholder="Farmer ID"
                        value={`Farmer ID: ${farmerId}`}
                        readOnly
                        style={{ color: '#808080', // Set the color to grey
                            userSelect: 'none', // Disable text selection
                            pointerEvents: 'none', // Disable pointer events
                            marginBottom: '10px', display: 'block' }
                        }
                    />
                    {validationErrors.farmerId && <small style={{ color: 'red' }}>{validationErrors.farmerId}</small>}
                    <button onClick={handleEnlistProduct} disabled={!isFormValid}>Enlist Product</button>
                    {confirmationMessage && <p>{confirmationMessage}</p>}
                </div>
                <div className="dashboard-section">
                    <h2>Your Products</h2>
                    <ProductList products={products} loggedInFarmerId={farmerId} />
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
