const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true},
    applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    status: {type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'}
},{
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const ApplicationModel = mongoose.model('applications', applicationSchema);

module.exports = { ApplicationModel };