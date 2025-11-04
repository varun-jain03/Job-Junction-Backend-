const { ApplicationModel } = require('../models/application.model.js');
const { JobModel } = require('../models/job.model.js');

//for students to apply new jobs
const applyJob = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobId } = req.params;

        const userRole = req.userRole;
        if (userRole == "recruiter") {
            console.log('recruiter cannot aplly for jobs...');
            return res.json({ msg: 'recruiter cannot apply for jobs...' });
        }

        if (!jobId) {
            console.log('job id is required...')
            return res.json({ msg: 'job id is required...' });
        }

        const job = await JobModel.findById(jobId);
        if (!job) {
            console.log('job not found...');
            return res.json({ msg: 'job not found...' });
        }

        const alreadyApplied = await ApplicationModel.findOne({ job: jobId, applicant: userId });
        if (alreadyApplied) {
            console.log('user have already applied for this job...');
            return res.json({ msg: 'user have already applied for this job...' });
        }

        //create new application
        const newApplication = new ApplicationModel({ job: jobId, applicant: userId });
        await newApplication.save();

        job.applicants.push(newApplication._id);
        await job.save();
        console.log('job applied successfully...');
        res.json({ msg: 'job applied successfully...' });



    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}

//for students to get all the jobs they have applied to
const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.userId;
        const userName = req.userName;

        const userRole = req.userRole;
        if (userRole == "recruiter") {
            console.log('only students can get their applied jobs data...');
            return res.json({ msg: 'only students can get their applied jobs data...' });
        }

        const appliedJobs = await ApplicationModel.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate('job');

        if (!appliedJobs) {
            console.log('no applied jobs...');
            return res.json({ msg: 'no applied jobs...' });
        }

        console.log(`there are all the jobs apllied by ${userName}...`, appliedJobs);
        res.json({ msg: `there are all the jobs apllied by ${userName}...`, appliedJobs: appliedJobs });
    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}

//for recruiter to check all the applicants
const getApplicants = async (req, res) => {
    try {
        const userRole = req.userRole;
        if (userRole === "student") {
            console.log('only recruiters can get all the applicants...');
            return res.json({ msg: 'only recruiters can get all the applicants...' });
        }

        const { jobId } = req.params;
        if (!jobId) {
            console.log('Job id is requried...');
            return res.json({ msg: 'Job id is required...' });
        }

        const jobApplicants = await JobModel.findById(jobId)
            .sort({ createdAt: -1 })
            .populate('applicants');
        if (!jobApplicants) {
            console.log('no one has applied to job yet...');
            return res.json({ msg: 'no one has applied to job yet...' });
        }

        console.log(jobApplicants);
        res.send(jobApplicants);
    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}

//updating status of the application
const statusUpdate = async (req, res) => {
    try {
        const { status } = req.body;
        const { applicationId } = req.params;
        if (!applicationId) {
            console.log('application id is required to update status...');
            return res.json({ msg: 'application id is required to update status...' });
        }

        const application = await ApplicationModel.findById(applicationId);
        if (!application) {
            console.log('application not found...');
            return res.json({ msg: 'application not found...' });
        }

        application.status = status;
        await application.save();
        console.log('status is updated...');
        res.json({ msg: 'status is updated...' });

    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}

//Get all applicants for all jobs posted by the recruiter
const getAllApplicantsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.userId;
    const userRole = req.userRole;

    if (userRole === "student") {
      return res.json({ msg: "Only recruiters can view applicants." });
    }

    const jobs = await JobModel.find({ userId: recruiterId })
      .populate({
        path: "applicants",
        populate: {
          path: "applicant",
          model: "users",
          select: "name email phoneNumber role profile",
        },
      })
      .populate("company_details", "company_name")
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.json({ msg: "No applicants found for your jobs.", jobs: [] });
    }

    res.json({
      msg: "All applicants for your jobs fetched successfully.",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ msg: "Server error", error });
  }
};

module.exports = { applyJob, getAppliedJobs, getApplicants, statusUpdate, getAllApplicantsForRecruiter };
