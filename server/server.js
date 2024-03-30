const express = require('express');
const cors = require("cors");
const collection = require("./mongo");
const connection = require('./sqlDB.js'); // Import MySQL connection
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Existing endpoint to check if user exists
app.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const check = await collection.findOne({ email: email });
        if (check) {
            res.json("exist");
        } else {
            res.json("notexist");
        }
    } catch (e) {
        console.error("Error checking user:", e);
        res.status(500).json("fail");
    }
});

// MongoDB signup endpoint
app.post("/signup-mongodb", async (req, res) => {
    const { email, password, userType } = req.body; // Include userType from request body
    try {
        // Check if user with the given email already exists
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            return res.json("exist");
        } else {
            // Create a new user document
            const newUser = new collection({
                email: email,
                password: password,
                userType: userType // Add userType to the user document
            });
            // Save the new user to the database
            await newUser.save();
            return res.json("notexist");
        }
    } catch (error) {
        console.error("Error signing up user in MongoDB:", error);
        return res.status(500).json("fail");
    }
});





// SQL Server signup endpoint
app.post("/signup-sqlserver", (req, res) => {
    const { email, contactNo, fname, minit, lname, userType } = req.body; // Include userType from request body

    // Check the userType and execute corresponding SQL query
    if (userType === 'farmer') {
        // SQL query to insert a new farmer
        connection.query('INSERT INTO farmers (email, contact_no, fname, minit, lname) VALUES (?, ?, ?, ?, ?)',
            [email, contactNo, fname, minit, lname],
            (error, results) => {
                if (error) {
                    console.error("Error inserting farmer:", error);
                    return res.status(500).json({ error: "Internal server error" });
                }
                // Farmer signed up successfully
                return res.json("notexist");
            });
    } else if (userType === 'buyer') {
        // SQL query to insert a new buyer
        connection.query('INSERT INTO buyer (bemail, bcontact, bfname, bminit, blname) VALUES (?, ?, ?, ?, ?)',
            [email, contactNo, fname, minit, lname], // Adjust column names as per your schema
            (error, results) => {
                if (error) {
                    console.error("Error inserting buyer:", error);
                    return res.status(500).json({ error: "Internal server error" });
                }
                // Buyer signed up successfully
                return res.json("notexist");
            });
    } else {
        // Invalid userType
        return res.status(400).json({ error: "Invalid user type" });
    }
});

// Other endpoints and server initialization (not shown for brevity)
// Endpoint to add a new product
app.post("/api/products", async (req, res) => {
    const { pname, pquality, pquantity, pprice, pdomain, farmer_id } = req.body;
    try {
        // Check if the farmer_id exists in the referenced table
        const farmerExists = await checkFarmerExists(farmer_id);
        if (!farmerExists) {
            return res.status(400).send("Farmer does not exist");
        }

        // Insert the new product into the database
        connection.query('INSERT INTO products (pname, pquality, pquantity, pprice, pdomain, farmer_id) VALUES (?, ?, ?, ?, ?, ?)',
            [pname, pquality, pquantity, pprice, pdomain, farmer_id],
            (error, results) => {
                if (error) {
                    console.error("Error inserting product:", error);
                    return res.status(500).json({ error: "Internal server error" });
                }
                // Product inserted successfully
                return res.send("Product added successfully");
            });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Function to check if farmer with the given ID exists
const checkFarmerExists = (farmer_id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM farmers WHERE farmer_id = ?', [farmer_id], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.length > 0);
        });
    });
};

app.get("/api/products", (req, res) => {
    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            console.error("Error retrieving products:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        // Return the products retrieved from the database
        res.json(results);
    });
});


cartItems = [];

app.post('/api/cart/add', (req, res) => {
    const { productId, quantity } = req.body;
  
    // Find the product by ID
    connection.query('SELECT * FROM products WHERE product_id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product from database:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = results[0];

        // Construct the cart item object with the original price
        const cartItem = {
            product_id: productId,
            quantity: quantity,
            pname: product.pname,
            pprice: product.pprice
        };

        // Add the item to cart
        cartItems.push(cartItem);

        res.status(200).json({ message: 'Item added to cart', cartItem });
    });
});

app.delete('/api/cart/:productId', (req, res) => {
    const productIdToDelete = req.params.productId;
    const index = cartItems.findIndex(item => item.productId === productIdToDelete);
    if (index !== -1) {
        cartItems.splice(index, 1);
        res.status(200).json({ message: 'Item deleted from cart successfully' });
    } else {
        res.status(404).json({ error: 'Item not found in cart' });
    }
});


app.post('/api/transactions', (req, res) => {
    const { price, trans_date, quantity, products } = req.body;
  
    // Insert transaction details into the transactions table
    const insertTransactionQuery = 'INSERT INTO transactions (price, trans_date, quantity) VALUES (?, ?, ?)';
    connection.query(insertTransactionQuery, [price, trans_date, quantity], (err, result) => {
      if (err) {
        console.error('Error inserting transaction details:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Get the transaction ID of the inserted transaction
      const transactionId = result.insertId;
  
      // Insert product IDs and transaction ID into the transaction_products table
      const insertTransactionProductsQuery = 'INSERT INTO transaction_products(transaction_id, product_id) VALUES ?';
      
      // Create an array of arrays containing the transaction ID and each product ID
      const values = products.map(productId => [transactionId, productId]);
      
      connection.query(insertTransactionProductsQuery, [values], (err, result) => {
        if (err) {
          console.error('Error inserting transaction products:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        res.status(200).json({ message: 'Transaction completed successfully' });
      });
    });
});




app.get('/api/cart', (req, res) => {
  res.status(200).json(cartItems);
});


app.listen(5000, () => { console.log("Server started on port 5000"); });

