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
router.get('/dashboard/:accountType/:Id/staffs',  RenderPages.getFacilityStaffs)
router.get('/dashboard/:accountType/:Id/appointments',  RenderPages.getFacilityAppointments)


module.exports = router

