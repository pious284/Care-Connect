const express = require('express')
const router = express.Router();
const hospitalController = require('../controller/hospitalsControllers')
const upload = require('../config/multer_file_uploader');


router.post('/hospital/register', upload.fields([
    {name: 'logo', maxCount: 1}
]), hospitalController.createHospital)


module.exports = router