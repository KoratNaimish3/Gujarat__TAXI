import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            return; // Already connected
        }

        // Check if connection is in progress
        if (mongoose.connection.readyState === 2) {
            // Wait for connection to complete
            await new Promise((resolve) => {
                mongoose.connection.once("connected", resolve);
            });
            return;
        }

        // Connect to database
        await mongoose.connect("mongodb://localhost:27017/gujrat_taxi");
        console.log("Database Connected");
    } catch (error) {
        console.log("Error in DB Connect", error.message);
        throw error;
    }
}

export default connectDB