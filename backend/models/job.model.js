const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    requiredSkills: [String],
    salary: {type: String, required: true},
    experience: {type: String, required: true},
    location: {type: String, required: true},
    jobType: {type: String, required: true, enum: ['full-time', 'part-time']},
    openings: {type: Number, default: 1},
    company_details: {type: mongoose.Schema.Types.ObjectId, ref: 'companys', required: true},
    company_name: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    applicants: [{type: mongoose.Schema.Types.ObjectId, ref: 'applications'}]
},{
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const JobModel = mongoose.model('jobs', jobSchema);

module.exports = { JobModel };


