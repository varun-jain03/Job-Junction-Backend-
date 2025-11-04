const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phoneNumber: {type: Number, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['recruiter', 'student']},
    profile: {
        bio: {type: String},
        skills: [String],
        resume: {type: String},
        company_details:{type: mongoose.Schema.Types.ObjectId, ref:'companys'},
        company_name:{type: String},
        profilePhoto:{type: String, default:""}
    }
},{
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const UserModel = mongoose.model('users', userSchema);

module.exports = { UserModel };