const express = require('express');
const RenderPages = require('../controller/pagesrender');
const router = express.Router();

router.get('/',  RenderPages.getHome)
router.get('/about',  RenderPages.getAbout)
router.get('/doctors',  RenderPages.getDoctors)
router.get('/contact',  RenderPages.getContacts)
router.get('/login',  RenderPages.getLogin)


module.exports = router

