const db = require('../config/db'); // Assuming the connection is established elsewhere

class Post {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    async save() {
        try {
            let d = new Date();
            let yyyy = d.getFullYear();
            let mm = d.getMonth() + 1; // Adjust for zero-based month indexing if needed
            let dd = d.getDate();

            let createdAt = `${yyyy}-${mm}-${dd}`; // Use `createdAt` for clarity

            const sql = `INSERT INTO buyer (buyer_id, bname) VALUES (?, ?)`; // Parameterized query
            const [newPost] = await db.execute(sql, [this.id, this.name]); // Bind parameters

            return newPost;
        } catch (error) {
            console.error('Error saving post:', error);
            throw error; // Re-throw for handling in the calling code
        }
    }

    static async findAll() {
        try {
            const sql = `SELECT * FROM buyer`; // Select all columns
            const [results] = await db.execute(sql);
            return results;
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Consider throwing or returning an error object for appropriate handling
        }
    }


    static async findById(id) {
        try {
            const sql = `SELECT * FROM buyer WHERE buyer_id = ?`; // Parameterized query
            const result = await db.execute(sql, [id]); // Store the entire result
    
            if (!result || !result.length) { // Handle both no result and empty result
                return null; // Return null for not found
            }
    
            const post = result[0]; // Access the first post from the result if found
            return post;
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            // Consider throwing or returning an error object for appropriate handling
        }
    }
    

    // static async findById(id) {
    //     try {
    //         const sql = `SELECT * FROM buyer WHERE buyer_id = ?`; // Parameterized query
    //         const [results] = await db.execute(sql, [id]);

    //         if (results.length === 0) {
    //             return null; // Return null for not found
    //         }

    //         return results[0]; // Return the first post if found
    //     } catch (error) {
    //         console.error('Error fetching post by ID:', error);
    //         // Consider throwing or returning an error object for appropriate handling
    //     }
    // }
}

module.exports = Post;
