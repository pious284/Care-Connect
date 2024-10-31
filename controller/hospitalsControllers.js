const Hospitals = require('../models/hospitals')
const { cloudinary, cleanupUploadedFile } = require('../config/cloudinaryConfig');
const initiatePaystackPayment = require('../utils/payment');


const hospitalController = {
    async createHospital(req, res) {
        try {
            const { name, username, email, contact, ambulancecontact, address, walletnumber, walletname, bio, password } = req.body;
            const existingHospital = await Hospitals.find({ email: new RegExp(`^${email}$`, 'i') })
            if (!existingHospital) {
                return res.status(400).json({ message: 'Email already registered With Another Hospital' });
            }

            let logoUrl = null;
            let publicId = null;
            if (req.files && req.files.logo) {
              const profileResult = await cloudinary.uploader.upload(
                req.files.logo[0].path,
                {
                  folder: "facilities_logo",
                }
              );
              logoUrl = profileResult.secure_url;
              publicId = profileResult.public_id;
            }

        const hashedPassword = await bcrypt.hash(password, 12);

        
        const newHospital = new Hospitals({
            name,
            bio,
            contact, 
            email, 
            username,
            wallet:{
                name: walletname,
                number: walletnumber
            } ,
            ambulancecontact,
            address,
            logo:{
                picture: logoUrl|| 'https://via.placeholder.com/150',
                publicId
            }
        });
        
        const initializePayment = initiatePaystackPayment(email, 300, newHospital);

        console.log('Initialize Payment Response', initializePayment);

        res.redirect(initializePayment.authourize_url);

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = hospitalController;