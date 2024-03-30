import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>Product Name: {product.pname}</h3>
          <p>Quality: {product.pquality}</p>
          <p>Quantity: {product.pquantity}</p>
          <p>Price: ${product.pprice}</p>
          <p>Domain: {product.pdomain}</p>
          <p>Farmer ID: {product.farmer_id}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
// import React from 'react';

// const ProductList = ({ products, loggedInFarmerId }) => {
//   // Filter products based on logged-in farmer's ID
//   const filteredProducts = products.filter(product => product.farmer_id === loggedInFarmerId);

//   return (
//     <div>
//       {filteredProducts.map(product => (
//         <div key={product.id}>
//           <h3>Product Name: {product.name}</h3>
//           <p>Quality: {product.quality}</p>
//           <p>Quantity: {product.quantity}</p>
//           <p>Price: ${product.price}</p>
//           <p>Domain: {product.domain}</p>
//           <p>Farmer ID: {product.farmer_id}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProductList;
