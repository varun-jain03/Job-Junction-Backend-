const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        mongoose.connect('mongodb+srv://varunjainjainj:varunjainjainj@cluster0.mpi4scp.mongodb.net/seekjob?retryWrites=true&w=majority&appName=Cluster0')
        console.log('connected to database');
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connectDB };