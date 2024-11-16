const Appointments = require("../models/appointments");
const Hospitals = require("../models/hospitals");
const patients = require("../models/patients");
const Pharmacies = require("../models/pharmacy");
const staffs = require("../models/staffs");


const RenderPages = {
    async getHome(req, res) {
        const alertMessage = req.flash("message");
        const alertStatus = req.flash("status");

        const alert = { message: alertMessage, status: alertStatus };

        try {
            const hospitals = await Hospitals.find({subscriptionstatus: true}).populate({
                path: 'staffs',
                match: { status: { $regex: '^Active$', $options: 'i' } },
                options: {
                    sort: { position: -1 },
                }
            })
            res.render('./Home/index', {
                hospitals,
                alert
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
            const alertMessage = req.flash("message");
            const alertStatus = req.flash("status");

            const alert = { message: alertMessage, status: alertStatus };


            res.render('./Home/login', { alert })
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
    async getPharmacyRegisteration(req, res) {
        try {

            res.render('./Home/registerPharmacy')
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getDashboard(req, res) {
        try {
            const alertMessage = req.flash("message");
            const alertStatus = req.flash("status");

            const alert = { message: alertMessage, status: alertStatus };

            const { Id, accountType } = req.params;

            let account = null;
            if (Id) {
                account = await Hospitals.findById(Id)
                    .populate('staffs')
                if (!account) {
                    account = await Pharmacies.findById(Id)
                        .populate('staffs')
                    if (!account) {
                        account = await staffs.findById(Id)
                        if (!account) {
                            account = await patients.findById(Id)

                        }
                    }
                }
            }
            res.render('./Dashboard/dashboard', { account, accountType, alert})
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getFacilityStaffs(req, res) {
        try {
            const alertMessage = req.flash("message");
            const alertStatus = req.flash("status");

            const alert = { message: alertMessage, status: alertStatus };

            const { Id, accountType } = req.params;

            let account = null;
            if (Id) {
                account = await Hospitals.findById(Id)
                    .populate({
                        path: 'staffs',
                        options: {
                            sort: { _id: -1 },
                        }
                    })
                if (!account) {
                    account = await Pharmacies.findById(Id)
                        .populate({
                            path: 'staffs',
                            options: {
                                sort: { _id: -1 },
                            }
                        })
                }
            }
            const facilitystaffs = account.staffs;
            // console.log(facilitystaffs)
            res.render('./Dashboard/staffs', {account ,staffs:facilitystaffs, accountType, alert})
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    async getFacilityAppointments(req, res) {
        try {
            const alertMessage = req.flash("message");
            const alertStatus = req.flash("status");

            const alert = { message: alertMessage, status: alertStatus };

            const { Id, accountType } = req.params;

            const appointments = await Appointments.find({facility: Id}).sort({isAttended: 1})

            let account = null;
            if (Id) {
                account = await Hospitals.findById(Id)
                    .populate({
                        path: 'staffs',
                        options: {
                            sort: { _id: -1 },
                        }
                    })
                if (!account) {
                    account = await Pharmacies.findById(Id)
                        .populate({
                            path: 'staffs',
                            options: {
                                sort: { _id: -1 },
                            }
                        })
                }
            }

            res.render('./Dashboard/appointments', {account ,appointments, accountType, alert})
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
}

module.exports = RenderPages;