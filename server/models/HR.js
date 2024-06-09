const mongoose = require('mongoose');

const HRSchema = new mongoose.Schema({    
    nip: { 
        type: String, 
        unique: true, 
        required: true 
    },
    name: String,
    gender: { 
        type: String, 
        enum: ["Male", "Female"]
    },
    email: String,
    phone: String,
    profile_photo: String,
    created_at: Date,
    updated_at: Date
}, {
    collection: 'tbl_hrs' 
});

const HRModel = mongoose.model("HR", HRSchema);
module.exports = HRModel;
