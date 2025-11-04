const { JobModel } = require('../models/job.model.js');


//for recruiter to post new jobs
const creatJob = async (req, res) => {
    try {
        const userRole = req.userRole;
        if (userRole === 'student') {
            console.log('only recruiter is authorized to post new job...');
            return res.json({ msg: 'only recruiter is authorized to post new job...' });
        }
        const { title, description, requiredSkills, salary, experience, location, jobType, openings, company_details, company_name } = req.body;
        const userId = req.userId;

        const newJob = JobModel({
            title,
            description,
            requiredSkills: requiredSkills
                .flatMap(skill => skill.split(',').map(s => s.trim())),
            salary,
            experience,
            location,
            jobType,
            openings,
            company_details,
            company_name,
            userId
        });
        await newJob.save();
        console.log('new job has been added...');
        res.json({ msg: 'new job has been added...', newJob });


    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}

//for recruiter to view all jobs posted by them
const getRecruiterJob = async (req, res) => {
    try {
        const userRole = req.userRole;
        if (userRole === 'student') {
            console.log('only recruiter is authorized to view the jobs posted by them...');
            return res.json({ msg: 'only recruiter is authorized to view the jobs posted by them...' });
        }

        const userId = req.userId;
        const jobs = await JobModel.find({ userId })
            .populate('company_details')
            .populate('applicants');
        if (!jobs) {
            console.log('No jobs found...');
            return res.json({ msg: 'no jobs found...' });
        }

        console.log(`RecruiterJobs: ${jobs}`);
        return res.json({ msg: 'jobs required....', jobs: jobs });



    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}

//for student to get job by jobid
const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await JobModel.findById(jobId)
            .populate('company_details')
            .populate('applicants');
        if (!job) {
            console.log('job with this job id not found...');
            return res.json({ msg: 'job with this job id not found...' });
        }

        console.log(job);
        return res.json({ msg: 'job found successfully...', job: job });
    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}

//for students to get all the jobs
const getAllJobs = async (req, res) => {
    try {
        // const allJobs = await JobModel.find()
        //     .populate({
        //         path: 'company_details',
        //         populate: { path: 'userId' }
        //     });


        const allJobs = await JobModel.find()
            .populate('company_details')
            .populate('applicants');
        if (!allJobs) {
            console.log('there are no jobs yet on the DB...');
            return res.json({ msg: 'there are no jobs yet on the DB' });
        }

        console.log('these are all the jobs in the database...');
        return res.json({ msg: 'these are all the jobs in the database...', jobs: allJobs });

    } catch (error) {
        console.log('not able to connect to the DB...', error);
        res.json({ msg: 'not ablee to connect to DB...', error });
    }
}


module.exports = { creatJob, getRecruiterJob, getJobById, getAllJobs };