const { ObjectId } = require("mongodb");
const connection = require('../config/db');

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
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

    getPublicProfile() {
        return { name: this.name, email: this.email };
    }
}

module.exports = User;