const express = require('express');
const { isAuthenticated } = require('../middlewares/isAuthenticated.js');
const { applyJob, getAppliedJobs, getApplicants, statusUpdate, getAllApplicantsForRecruiter } = require('../controller/application.controller.js');


const applicationRouter = express.Router();

applicationRouter.get('/', isAuthenticated, getAppliedJobs);
applicationRouter.post('/apply/:jobId', isAuthenticated, applyJob);
applicationRouter.get('/applicants/:jobId', isAuthenticated, getApplicants);
applicationRouter.post('/status/:applicationId', isAuthenticated, statusUpdate);
applicationRouter.get('/applicants', isAuthenticated, getAllApplicantsForRecruiter);




module.exports = { applicationRouter };