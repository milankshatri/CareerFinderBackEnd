const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');




class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async save() {
        const url = process.env.MONGO_URL;
        const client = new MongoClient(url, { useNewUrlParser: true });
        try {
            await client.connect();
            const db = client.db();
            const usersCollection = db.collection('users');

            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            const result = await usersCollection.insertOne(this);

            return result.ops[0];
        } catch (error) {
            console.log(error);
            throw new Error(error);
        } finally {
            client.close();
        }
    }

    static async findByEmail(email) {
        const url = process.env.MONGO_URL;
        const client = new MongoClient(url, { useNewUrlParser: true });
        try {
            await client.connect();
            const db = client.db();
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ email });
            return user;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        } finally {
            client.close();
        }
    }

    static async findById(id) {
        const url = process.env.MONGO_URL;
        const client = new MongoClient(url, { useNewUrlParser: true });
        try {
            await client.connect();
            const db = client.db();
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ _id: new ObjectID(id) });
            return user;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        } finally {
            client.close();
        }
    }

    async comparePassword(password) {
        const match = await bcrypt.compare(password, this.password);
        return match;
    }
}

module.exports = User;