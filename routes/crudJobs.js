const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/jobs');
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

router.post('/jobs', auth, async (req, res) => {
    try {
        const {
            jobTitle,
            companyName,
            requiredQualification,
            experience,
            salary,
            jobLocation,
            jobType,
            contactEmail,
            jobDescription,
        } = req.body;

        const newJob = new Job(
            jobTitle,
            companyName,
            requiredQualification,
            experience,
            salary,
            jobLocation,
            jobType,
            contactEmail,
            jobDescription
        );

        await newJob.save();
        res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/jobs/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/jobs/:id', auth, async (req, res) => {
    try {
        const jobId = req.params.id;
        const updatedJob = req.body;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        await job.updateJobDetails(updatedJob);
        res.json({ message: 'Job updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/jobs/:id', auth, async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Perform the deletion here, e.g., job.delete();
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;