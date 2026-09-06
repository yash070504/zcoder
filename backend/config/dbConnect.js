const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        let uri = process.env.DATABASE_URI;
        if (!uri || uri.includes("<db_password>")) {
            uri = "mongodb+srv://yashkumar070504:yash@cluster0.1uleav1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        }
        await mongoose.connect(uri);
        console.log("MongoDB connection established successfully.");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
};

module.exports = connectdb;