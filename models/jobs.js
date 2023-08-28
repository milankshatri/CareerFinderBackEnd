const { ObjectId } = require("mongodb");
const connection = require('../config/db');

class Job {
    constructor(jobTitle, companyName, requiredQualification, experience, salary, jobLocation, jobType, contactEmail, jobDescription) {
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.requiredQualification = requiredQualification;
        this.experience = experience;
        this.salary = salary;
        this.jobLocation = jobLocation;
        this.jobType = jobType;
        this.contactEmail = contactEmail;
        this.jobDescription = jobDescription;
    }

    async save() {
        if (!connection.isConnected()) {
            return Promise.reject(new Error("Database is not connected"));
        }

        const dbInstance = connection.client.db("test");
        const collection = dbInstance.collection("jobs");
        return collection.insertOne(this);
    }

    static async findById(id) {
        if (!connection.isConnected()) {
            return Promise.reject(new Error("Database is not connected"));
        }

        const dbInstance = connection.client.db("test");
        const collection = dbInstance.collection("jobs");
        return collection.findOne({ _id: new ObjectId(id) });
    }

    async updateJobDetails(updatedJob) {
        if (!connection.isConnected()) {
            throw new Error("Database is not connected");
        }

        const dbInstance = connection.client.db("test");
        const collection = dbInstance.collection("jobs");
        await collection.updateOne(
            { _id: new ObjectId(this._id) },
            { $set: updatedJob }
        );
    }

    getJobSummary() {
        return {
            jobTitle: this.jobTitle,
            companyName: this.companyName,
            salary: this.salary,
            jobLocation: this.jobLocation,
            jobType: this.jobType,
        };
    }
}

module.exports = Job;