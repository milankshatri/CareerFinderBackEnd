const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const MongoClient = require("mongodb").MongoClient;

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connect = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.log(`Error connecting to MongoDB Atlas: ${error}`);
    }
};

const isConnected = () => {
    return client.isConnected();
};

const close = () => {
    client.close();
};

module.exports = { connect, isConnected, close };
