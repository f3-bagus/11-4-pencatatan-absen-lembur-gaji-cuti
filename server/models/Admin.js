const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({    
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
    collection: 'tbl_admins' 
});

AdminSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;
