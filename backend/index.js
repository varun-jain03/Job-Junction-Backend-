const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database/configDB.js');
const { userRouter } = require('./routes/user.route.js');
const { companyRouter } = require('./routes/company.route.js');
const { jobRouter } = require('./routes/job.route.js');
const { applicationRouter } = require('./routes/application.route.js');

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


//routes
app.use('/user', userRouter);
app.use('/company', companyRouter);
app.use('/job', jobRouter);
app.use('/application', applicationRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});



app.listen(8080, () => {
    connectDB();
    console.log('server running at port http://localhost:8080')
})