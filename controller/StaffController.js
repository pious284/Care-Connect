const Staffs = require('../models/staffs');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../config/cloudinaryConfig')

const staffController = {
    
    async getstaffs(req, res){
        try{
            const staffs = await Staffs.find();
            
            res.status(200).json({success: true, message:"Staffs account data retrieved successful", staffs})
        }catch(error){
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getstaffsByID(req, res){
        try{
            const {staffId} = req.params
            const staff = await Staffs.findById(staffId);
            
            if(!staff){
                res.status(404).json({success: false, message: "Unable to find staff"})
            }
            
            res.status(200).json({success: true, message:"Staff data retrieved successful", staff})
        }catch(error){
            console.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Create new staff member with profile image
   async createStaff(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If there's an uploaded file, delete it from cloudinary
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        firstname,
        middlename,
        lastname,
        gender,
        dob,
        cardnumber,
        email,
        maritalstatuse,
        position,
        status,
        contact,
        password,
      } = req.body;

      // Check if email already exists
      const existingStaff = await Staff.findOne({ email });
      if (existingStaff) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Generate unique staffId
      const staffId = `STAFF${Date.now().toString().slice(-6)}`;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Get profile image URL if uploaded
      const profile = req.file ? req.file.path : 
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

      // Create new staff
      const newStaff = new Staff({
        title,
        firstname,
        middlename,
        lastname,
        gender,
        dob,
        cardnumber,
        email,
        maritalstatuse,
        staffId,
        position,
        status: status || 'offline',
        contact,
        password: hashedPassword,
        profile
      });

      await newStaff.save();

      // Remove password from response
      const staffResponse = newStaff.toObject();
      delete staffResponse.password;

      res.status(201).json({
        message: 'Staff created successfully',
        staff: staffResponse
      });

    } catch (error) {
      // If there's an error and a file was uploaded, delete it
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      console.error('Create staff error:', error);
      res.status(500).json({ message: 'Error creating staff member', error: error.message });
    }
  },

  // Update staff profile image
   async updateProfileImage(req, res) {
    try {
      const staffId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const staff = await Staff.findById(staffId);
      if (!staff) {
        // Delete uploaded file if staff not found
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(404).json({ message: 'Staff member not found' });
      }

      // If staff has an existing profile image (not the default), delete it
      if (staff.profile && !staff.profile.includes('blank-profile-picture')) {
        const publicId = staff.profile.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Update profile image URL
      staff.profile = req.file.path;
      await staff.save();

      res.status(200).json({
        message: 'Profile image updated successfully',
        profile: staff.profile
      });

    } catch (error) {
      // If there's an error, delete the uploaded file
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      console.error('Update profile image error:', error);
      res.status(500).json({ message: 'Error updating profile image', error: error.message });
    }
  },

  // Update staff member (modified to handle profile image update)
   async updateStaff(req, res) {
    try {
      const staffId = req.params.id;
      const updates = req.body;

      // Remove fields that shouldn't be updated directly
      delete updates.password;
      delete updates.staffId;
      delete updates.email;

      // If there's a new profile image
      if (req.file) {
        updates.profile = req.file.path;

        // Delete old profile image if it exists and is not the default
        const staff = await Staff.findById(staffId);
        if (staff && staff.profile && !staff.profile.includes('blank-profile-picture')) {
          const publicId = staff.profile.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Find and update staff
      const updatedStaff = await Staff.findByIdAndUpdate(
        staffId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedStaff) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(404).json({ message: 'Staff member not found' });
      }

      res.status(200).json({
        message: 'Staff updated successfully',
        staff: updatedStaff
      });

    } catch (error) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      console.error('Update staff error:', error);
      res.status(500).json({ message: 'Error updating staff member', error: error.message });
    }
  },

  // Delete staff member (modified to delete profile image)
   async deleteStaff(req, res) {
    try {
      const staffId = req.params.id;

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      // Delete profile image from Cloudinary if it exists and is not the default
      if (staff.profile && !staff.profile.includes('blank-profile-picture')) {
        const publicId = staff.profile.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await staff.remove();

      res.status(200).json({ message: 'Staff member deleted successfully' });

    } catch (error) {
      console.error('Delete staff error:', error);
      res.status(500).json({ message: 'Error deleting staff member', error: error.message });
    }
  }
    

}

module.exports = staffController;