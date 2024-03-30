import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>Product Name: {product.pname}</h3>
          <p>Quality: {product.pquality}</p>
          <p>Quantity: {product.pquantity}</p>
          <p>Price: ₹{product.pprice}</p>
          <p>Domain: {product.pdomain}</p>
          <p>Farmer ID: {product.farmer_id}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

