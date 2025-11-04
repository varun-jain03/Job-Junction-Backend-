const express = require('express');
const { isAuthenticated } = require('../middlewares/isAuthenticated.js');
const { registerCompany, getCompany, getCompanyById, updateCompany } = require('../controller/company.controller.js');

const companyRouter = express.Router();

companyRouter.get('/', isAuthenticated, getCompany);
companyRouter.get('/:companyid', isAuthenticated, getCompanyById);
companyRouter.post('/register', isAuthenticated, registerCompany);
companyRouter.patch('/update/:companyid', isAuthenticated, updateCompany);

module.exports = { companyRouter };