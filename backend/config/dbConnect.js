const mongoose = require("mongoose");

const connectdb = async() => {
    try{
       await mongoose.connect("mongodb+srv://yashkumar070504:yash@cluster0.1uleav1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    }catch (err){
             console.log(err);
    }
}

module.exports = connectdb ;