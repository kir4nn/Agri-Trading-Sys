const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Credentials", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((error) => {
  console.error("MongoDB connection failed:", error);
});

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: { // Add userType field
    type: String,
    enum: ['farmer', 'buyer'] // Enumerate allowed values
  }
});

const collection = mongoose.model("collections", newSchema);

module.exports = collection;
