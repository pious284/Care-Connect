const Phamarcy = require('../models/pharmacy')

const PhamarcyConttroller = {
    async getAllPhamarcies(req, res){
        try {
            const Phamarcies = await Phamarcy.find().populate('Staffs');

            if (!Phamarcies) {
                res.status(404).json({message : "The is no records found", success: false})
            }
            res.status(200).json({message:"Phamarcies data retrieved successfully", success: true})
        } catch (error) {
            res.status(500).json({message: error.message, success: false})
        }
    },
    async getPhamarciesById(req, res){
        try {
            const {phamarcyId} = req.params;

            const Phamarcies = await Phamarcy.findById(phamarcyId).populate('Staffs');

            if (!Phamarcies) {
                res.status(404).json({message : "The is no records found", success: false})
            }
            res.status(200).json({message:"Phamarcies data retrieved successfully", success: true})
        } catch (error) {
            res.status(500).json({message: error.message, success: false})
        }
    },
    async deletePhamarciesById(req, res){
        try {
            const {phamarcyId} = req.params;

            const Phamarcies = await Phamarcy.findByIdAndDelete(phamarcyId);

            if (!Phamarcies) {
                res.status(404).json({message : "The is no records found", success: false})
            }
            res.status(200).json({message:"Phamarcies data deleted successfully", success: true})
        } catch (error) {
            res.status(500).json({message: error.message, success: false})
        }
    },
    

}