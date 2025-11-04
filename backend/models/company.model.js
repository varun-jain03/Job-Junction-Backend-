const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: {type: String, required: true, unique: true},
    description: {type: String},
    website: {type: String},
    location: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true}
},{
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const CompanyModel = mongoose.model('companys', companySchema);

module.exports = { CompanyModel };