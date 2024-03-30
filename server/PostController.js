const Post = require('./Post'); // Assuming the `../models/Post` file is present

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll(); // Assuming `findAll()` is implemented correctly in `Post`
        res.status(200).json({ posts }); // Send the response with correct data structure
    } catch (err) {
        console.error('Error fetching posts:', err);
        next(err); // Pass the error to the next middleware for handling
    }
};

exports.createNewPost = async (req, res, next) => {
    try {
        let { id, name } = req.body; // Destructure and validate data (consider using a validation library)
        let post = new Post(id, name);

        post = await post.save(); // Assuming `save()` is implemented correctly in `Post`
        res.status(201).json({ message: "Post Created" }); // Send success response
    } catch (err) {
        console.error('Error creating post:', err);
        next(err); // Pass the error to the next middleware for handling
    }
};

exports.getPostById = async (req, res, next) => {
    try {
        let postID = req.params.id; // Extract the post ID from request parameters

        // Assuming `findById` is implemented correctly in `Post` (handle potential errors):
        // const [post, _] = await Post.findById(postID);
        // if (!post) {
        //     return res.status(404).json({ message: "Post not found" }); // Handle not-found errors
        // }
        const [post] = await Post.findById(postID);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }   


        res.status(200).json({ post }); // Send the post data
    } catch (err) {
        console.error('Error fetching post by ID:', err);
        next(err); // Pass the error to the next middleware for handling
    }
};
