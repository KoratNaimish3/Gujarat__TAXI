import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            return; // Already connected
        }

        // Check if connection is in progress
        if (mongoose.connection.readyState === 2) {
            // Wait for connection to complete
            await new Promise((resolve, reject) => {
                mongoose.connection.once("connected", resolve);
                mongoose.connection.once("error", reject);
            });
            return;
        }

        // Check if MONGO_URL is set
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not set. Please add it to your .env.local file.");
        }

        // Validate and clean MONGO_URL format
        let mongoUrl = process.env.MONGO_URL.trim();
        
        // Remove surrounding quotes if present
        mongoUrl = mongoUrl.replace(/^["']|["']$/g, '');
        
        if (!mongoUrl.startsWith("mongodb://") && !mongoUrl.startsWith("mongodb+srv://")) {
            throw new Error("MONGO_URL must start with 'mongodb://' or 'mongodb+srv://'");
        }

        // Check for multiple @ symbols (common mistake)
        const atCount = (mongoUrl.match(/@/g) || []).length;
        if (atCount > 1) {
            throw new Error(`MONGO_URL has ${atCount} @ symbols. Connection string should have only ONE @ symbol between credentials and host. Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database`);
        }

        // Check if connection string appears complete (for mongodb+srv, should contain .mongodb.net)
        if (mongoUrl.startsWith("mongodb+srv://") && !mongoUrl.includes(".mongodb.net")) {
            throw new Error("MONGO_URL appears incomplete. MongoDB Atlas connection string should include '.mongodb.net' domain. Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name");
        }

        // Connect to database with options for MongoDB Atlas
        const options = {
            serverSelectionTimeoutMS: 10000, // Increased timeout for initial connection
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            connectTimeoutMS: 10000, // Connection timeout
        };

        await mongoose.connect(mongoUrl, options);
        console.log("✅ Database Connected Successfully");
        
        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

    } catch (error) {
        console.error("❌ Error in DB Connect:", error.message);
        
        // Provide helpful error messages
        if (error.message.includes("MONGO_URL")) {
            console.error("\n💡 Please add MONGO_URL to your .env.local file:");
            console.error("   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority\n");
        } else if (error.message.includes("authentication failed")) {
            console.error("\n💡 Authentication failed. Please check your MongoDB Atlas username and password.\n");
        } else if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo") || error.message.includes("querySrv")) {
            console.error("\n💡 Cannot reach MongoDB Atlas. This usually means:");
            console.error("   1. ❌ Connection string is incomplete or malformed");
            console.error("      - Check that your MONGO_URL includes the full cluster domain");
            console.error("      - Format should be: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database");
            console.error("      - Make sure there's only ONE @ symbol (between credentials and host)");
            console.error("      - Remove any quotes around the connection string");
            console.error("   2. 🌐 Your internet connection");
            console.error("   3. 🗄️  MongoDB Atlas cluster is running");
            console.error("   4. 🔒 Your IP address is whitelisted in MongoDB Atlas Network Access");
            console.error("      - Go to Network Access → Add IP Address (or use 0.0.0.0/0 for development)\n");
            console.error("   📝 Example correct format:");
            console.error("   MONGO_URL=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/gujarattaxi?retryWrites=true&w=majority\n");
        } else if (error.message.includes("incomplete") || error.message.includes("must start with") || error.message.includes("@ symbols")) {
            console.error("\n💡 Connection string format error:");
            console.error(`   ${error.message}\n`);
            console.error("   🔧 Common fixes:");
            console.error("   - Remove extra @ symbols (should be only one: username:password@host)");
            console.error("   - Remove quotes around the connection string");
            console.error("   - Ensure format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database\n");
        }
        
        throw error;
    }
}

export default connectDB