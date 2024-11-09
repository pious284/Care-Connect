const express = require('express');
const RenderPages = require('../controller/pagesrender');
const router = express.Router();

router.get('/',  RenderPages.getHome)
router.get('/about',  RenderPages.getAbout)
router.get('/doctors',  RenderPages.getDoctors)
router.get('/contact',  RenderPages.getContacts)
router.get('/login',  RenderPages.getLogin)
router.get('/register',  RenderPages.getRegisteration)
router.get('/register/hospital',  RenderPages.getHospitalRegisteration)
router.get('/register/pharmacy',  RenderPages.getPharmacyRegisteration)

// dashboard pages
router.get('/dashboard/:accountType/:Id',  RenderPages.getDashboard)


module.exports = router

