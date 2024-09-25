import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log(`mongo uri : ${process.env.MONGO_URI}`);
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${con.connection.host}`)
    } catch (error) {
        console.log("Error connection to MongoDB:", error.message);   
        process.exit(1) // status code 1 for failure, 0 for success
    }
}