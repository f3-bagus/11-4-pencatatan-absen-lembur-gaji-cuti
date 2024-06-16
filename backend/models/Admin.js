const moment = require('moment-timezone');
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    nip: { 
        type: String, 
        unique: true, 
        required: true 
    },
    name: {
        type: String,
        default: null
    },
    gender: { 
        type: String, 
        enum: ["male", "female"],
        default: "male"
    },
    email: { 
        type: String, 
        unique: true, 
        default: null
    },
    phone: { 
        type: String, 
        unique: true,
        default: null 
    },
    profile_photo: {
        type: String,
        default: null
    },
    archived: { 
        type: Number,
        enum: [0, 1],
        default: 0 
    },
    created_at: { 
        type: Date, 
        default: () => moment().toDate() 
    },
    updated_at: { 
        type: Date, 
        default: () => moment().toDate() 
    }
}, { 
    collection: 'tbl_admins' 
});

AdminSchema.pre('save', function(next) {
    this.updated_at = moment().toDate();
    next();
});

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;
