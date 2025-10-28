import mongoose from "mongoose";

// Define the type for the cached connection
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

// Extend the global object to include our mongoose cache
// Typed handle to globalThis to persist cache across hot reloads without name collision
const globalForMongoose = globalThis as unknown as {
    mongooseCache?: MongooseCache;
};

// Read at call time to avoid import-time failures in build environments
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize the cache on the global object to survive hot reloads in development
let cached: MongooseCache =
    globalForMongoose.mongooseCache || {conn: null, promise: null};
if (!globalForMongoose.mongooseCache) {
    globalForMongoose.mongooseCache = cached;
}

// Validate that the MongoDB URI is defined

// @ts-ignore
async function connectDB(): Promise<typeof mongoose> {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );
    }
    // Return existing connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // If no promise exists, create a new connection
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering to throw errors immediately if not connected
            // Slight hardening; tune as needed
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(uri, opts);
    }




    /**
     * Establishes and caches a connection to MongoDB.
     *
     * In development, Next.js hot-reloading can cause multiple connections.
     * Caching prevents this by reusing an existing connection when available.
     *
     * @returns {Promise<typeof mongoose>} The mongoose instance with an active connection
     */
    async function connectDB(): Promise<typeof mongoose> {
        // Return existing connection if available
        if (cached.conn) {
            return cached.conn;
        }

        // If no promise exists, create a new connection
        if (!cached.promise) {
            const opts = {
                bufferCommands: false, // Disable buffering to throw errors immediately if not connected
            };

            cached.promise = mongoose.connect(MONGODB_URI as string, opts);
        }

        try {
            // Await the connection promise and cache the result
            cached.conn = await cached.promise;
        } catch (error) {
            // Reset promise on failure so the next call can retry
            cached.promise = null;
            throw error;
        }

        return cached.conn;
    }

    export default connectDB;
