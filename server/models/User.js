const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nip: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: String,
    role: { 
        type: String, 
        enum: ["admin", "employee", "hr"],
        default: "employee"
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
    collection: 'tbl_users' 
});

UserSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
