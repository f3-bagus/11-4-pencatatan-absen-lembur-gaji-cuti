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
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
}, {
    collection: 'tbl_hrs' 
});

HRSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const HRModel = mongoose.model("HR", HRSchema);
module.exports = HRModel;
