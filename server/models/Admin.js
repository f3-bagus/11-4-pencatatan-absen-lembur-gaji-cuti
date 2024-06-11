const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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
    email: { 
        type: String, 
        unique: true, 
    },
    phone: { 
        type: String, 
        unique: true, 
    },
    profile_photo: String,
    archived: { 
        type: Number,
        enum: [0, 1],
        default: 0 
    },
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
