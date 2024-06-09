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
        enum: ["admin", "employee", "hr"] ,
        default: "employee"
    },
    verified: { 
        type: Boolean, 
        default: false 
    }
}, { 
    collection: 'tbl_users' 
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
