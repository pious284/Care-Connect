const Hospitals = require('../models/hospitals')
const { cloudinary, cleanupUploadedFile } = require('../config/cloudinaryConfig');
const bcrypt = require('bcrypt')
const initiatePaystackPayment = require('../utils/payment');


const hospitalController = {
    async createHospital(req, res) {
        try {
            const { name, username, email, contact, ambulancecontact, address, walletnumber, walletname, bio, password } = req.body;
            const existingHospital = await Hospitals.find({ email: new RegExp(`^${email}$`, 'i') });

            if (existingHospital.length > 0) {  // Changed condition to check length
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
                password: hashedPassword, // Added missing password field
                wallet: {
                    name: walletname,
                    number: walletnumber
                },
                ambulancecontact,
                address,
                logo: {
                    picture: logoUrl || 'https://via.placeholder.com/150',
                    publicId
                }
            });

            // Initialize payment before saving
            const initializePayment = await initiatePaystackPayment(email, 300, newHospital);

            // Save the hospital
            await newHospital.save();

            // Return success response with payment details
            return res.status(201).json({
                success: true,
                message: "Hospital account registered successfully. Please complete subscription to continue",
                paymentDetails: initializePayment
            });

        } catch (error) {
            console.error('Hospital registration error:', error);
            return res.status(500).json({
                success: false,
                message: "An error occurred during registration. Please try again."
            });
        }
    }
}

module.exports = hospitalController;