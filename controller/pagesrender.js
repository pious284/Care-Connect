const staffs = require("../models/staffs");


const RenderPages = {
    async getHome(req, res) {
        try {
            const doctors = await staffs.find({status: 'Active'})

            console.log("Doctors", doctors)
            res.render('./Home/index', {doctors})
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getAbout(req,res ){
        try {
            const doctors = await staffs.find({status: 'Active'})
            res.render('./Home/about', {doctors})
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getDoctors(req,res ){
        try {
            const doctors = await staffs.find({status: 'Active'})
            res.render('./Home/doctors', {doctors})
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getContacts(req,res ){
        try {
            const doctors = await staffs.find({status: 'Active'})
            res.render('./Home/contact', {doctors})
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getLogin(req, res){
        try {
            res.render('./Home/login', )
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = RenderPages;