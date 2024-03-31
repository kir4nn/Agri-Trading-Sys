const express = require('express');
const cors = require("cors");
const collection = require("./mongo");
const connection = require('./sqlDB.js'); // Import MySQL connection
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  

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

// In your Server.js file

// In your Server.js file

app.post("/check-user", async (req, res) => {
    const { email } = req.body;
    try {
        // Check if the user exists in the MongoDB collection
        const mongoUser = await collection.findOne({ email: email });
        
        if (mongoUser) {
            // User exists in either MongoDB or SQL database
            const userType = mongoUser.userType;
            res.json({ exists: true, userType: userType });
        } else {
            // User does not exist
            res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({ error: "Internal server error" });
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

app.post('/api/transactions', (req, res) => {
    const { products } = req.body;

    // Construct the values to be inserted into the transactions table
    const values = products.map(product => [
        product.price, // Price for the product
        new Date().toISOString().slice(0, 10), // Current date
        product.quantity,
        product.product_id
    ]);

    // Insert the transaction details and product IDs into the transactions table
    const insertTransactionQuery = 'INSERT INTO transactions (price, trans_date, quantity, product_id) VALUES ?';

    connection.query(insertTransactionQuery, [values], (err, result) => {
        if (err) {
            console.error('Error inserting transaction details:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Transaction completed successfully' });
    });
});

// Endpoint to handle user login
app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists in the MongoDB collection
        const mongoUser = await collection.findOne({ email: email });
        
        if (mongoUser) {
            // User exists, now check if the password matches
            if (mongoUser.password === password) {
                // Password matches, send success response
                res.json("success");
            } else {
                // Password doesn't match, send error response
                res.json("incorrect");
            }
        } else {
            // User does not exist, send error response
            res.json("notexist");
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint to fetch buyer ID using buyer email
app.get("/api/buyer-id", async (req, res) => {
    const { email } = req.query;
    console.log("this is email", email)
    const sql="SELECT buyer_id FROM buyer WHERE bemail = ?"

    connection.query(sql, [email], (err, result)=>{
        if(err){
            console.error("Error fetching id with email from MySQL:", err.message);
            res.status(500).json({ error: err.message });
        }else {
            if (result.length == 0) {
                console.log('No id found with the specified buyer email:', email);
                res.status(404).json({ error: 'No id found with the specified buyer email' });
            } else {
                console.log('ids fetched from MySQL:', result);
                res.json(result);
            }
            }
    })
});

// Endpoint to fetch farmer ID using buyer email
app.get("/api/farmer-id", async (req, res) => {
    const { email } = req.query;
    console.log("this is email", email)
    const sql="SELECT farmer_id FROM farmers WHERE email = ?"

    connection.query(sql, [email], (err, result)=>{
        if(err){
            console.error("Error fetching id with email from MySQL:", err.message);
            res.status(500).json({ error: err.message });
        }else {
            if (result.length == 0) {
                console.log('No id found with the specified farmer email:', email);
                res.status(404).json({ error: 'No id found with the specified farmer email' });
            } else {
                console.log('ids fetched from MySQL:', result);
                res.json(result);
            }
            }
    })
});

app.get('/api/cart', (req, res) => {
  res.status(200).json(cartItems);
});


app.listen(5000, () => { console.log("Server started on port 5000"); });

