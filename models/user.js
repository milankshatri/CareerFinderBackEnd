const { ObjectId } = require("mongodb");
const connection = require('../config/db');

class User {
    constructor(name, email, phoneNumber, password) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }

    async save() {
        if (!connection.isConnected()) {
            return Promise.reject(new Error("Database is not connected"));
        }

        const dbInstance = connection.client.db("test");
        const collection = dbInstance.collection("users");
        return collection.insertOne(this);
    }

    static async findByEmail(email) {
        if (!connection.isConnected()) {
            return Promise.reject(new Error("Database is not connected"));
        }

        const dbInstance = connection.client.db("test");
        const collection = dbInstance.collection("users");
        return collection.findOne({ email });
    }

    static async findById(id) {
        if (!connection.isConnected()) {
            return Promise.reject(new Error("Database is not connected"));
        }

        const dbInstance = connection.client.db("test");
        const collection = dbInstance.collection("users");
        return collection.findOne({ _id: new ObjectId(id) });
    }

    async updateRefreshToken(refreshToken) {
        if (!connection.isConnected()) {
          throw new Error("Database is not connected");
        }
    
        const dbInstance = connection.client.db("test");
        const collection = dbInstance.collection("users");
        await collection.updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { refreshToken } }
        );
    }

    getPublicProfile() {
        return { name: this.name, email: this.email };
    }
}

module.exports = User;