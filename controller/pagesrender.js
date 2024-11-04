const Hospitals = require("../models/hospitals");
const staffs = require("../models/staffs");


const RenderPages = {
    async getHome(req, res) {
        try {
            const doctors = await staffs.find({ status: new RegExp(`^Active$`, 'i') })
            const hospitals = await Hospitals.find().populate({
                path: 'staffs',
                match: { status: { $regex: '^Active$', $options: 'i' } },
                options: {
                    sort: { position: -1 },
                }
            })
            res.render('./Home/index', {
                doctors,
                hospitals
            })
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getAbout(req, res) {
        try {
            const doctors = await staffs.find({ status: 'Active' })
            res.render('./Home/about', { doctors })
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getDoctors(req, res) {
        try {
            const doctors = await staffs.find({ status: 'Active' })
            res.render('./Home/doctors', { doctors })
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getContacts(req, res) {
        try {
            const doctors = await staffs.find({ status: 'Active' })
            res.render('./Home/contact', { doctors })
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getLogin(req, res) {
        try {
            res.render('./Home/login',)
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getRegisteration(req, res) {
        try {

            res.render('./Home/registeration')
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getHospitalRegisteration(req, res) {
        try {

            res.render('./Home/registerHospital')
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
}

module.exports = RenderPages;