const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Database connected successfully");
        
    } catch (error) {
        console.log(error.message);
        
    }
}

connectDb();