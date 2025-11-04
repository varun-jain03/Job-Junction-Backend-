const { CompanyModel } = require('../models/company.model.js');

const registerCompany = async (req, res) => {
    try {
        const userId = req.userId;
        const { companyName, description, website, location, logo } = req.body;
        const newCompany = new CompanyModel({ companyName, description, website, location, logo, userId });
        await newCompany.save();
        console.log('new company has been added...');
        res.json({ msg: 'new company has been added...' });

    } catch (error) {
        console.log(error);
        res.json({ msg: "not able to connect to DB...", error })
    }
}

const getCompany = async (req, res) => {
    try {
        const userId = req.userId;
        const companies = await CompanyModel.find({ userId });
        if (!companies) {
            console.log('no company found...');
            res.json({ msg: 'No company found...' });
        } else {
            console.log(`company: ${companies}`);
            res.json({ msg: 'get request successfull...', companies });
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "not able to connect to DB...", error });
    }
}

const getCompanyById = async (req, res) => {
    try {
        const { companyid } = req.params;
        const company = await CompanyModel.findById(companyid);
        if (!company) {
            console.log('no company found...');
            res.json({ msg: 'No company found...', company });
        } else {
            console.log(`company: ${company}`);
            res.json({ msg: 'get request successfull...', company });
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "not able to connect to DB...", error });
    }
}

const updateCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;
        const { companyid } = req.params;
        const updateData = { companyName, description, website, location };
        const updatedCompany = await CompanyModel.findByIdAndUpdate(
            companyid,
            { $set: updateData },
            { new: true }
        );
        if (!updatedCompany) {
            console.log('Company not found...')
            return res.json({ msg: 'Company not found...' });
        }
        console.log('Company updated successfully...')
        res.json({ msg: 'Company updated successfully...', company: updatedCompany });



    } catch (error) {
        console.log(error);
        res.json({ msg: "not able to connect to DB...", error });
    }
}

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany };