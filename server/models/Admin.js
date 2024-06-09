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
    profile_photo: String
}, { 
    collection: 'tbl_admins' 
});

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;
