const express = require('express');
const { isAuthenticated } = require('../middlewares/isAuthenticated.js');
const { creatJob, getRecruiterJob, getJobById, getAllJobs } = require('../controller/job.controller.js');

const jobRouter = express.Router();

jobRouter.post('/', isAuthenticated, creatJob);
jobRouter.get('/recruiter/job', isAuthenticated, getRecruiterJob);
jobRouter.get('/', isAuthenticated, getAllJobs);
jobRouter.get('/student/:jobId', isAuthenticated, getJobById);



module.exports = { jobRouter };