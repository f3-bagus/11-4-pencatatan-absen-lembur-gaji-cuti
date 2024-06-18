const moment = require('moment');
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
    archived: { 
        type: Number,
        enum: [0, 1], 
        default: 0 
    },
    created_at: { 
        type: Date, 
        default: () => moment().add(7, 'hours').toDate() 
    },
    updated_at: { 
        type: Date, 
        default: () => moment().add(7, 'hours').toDate() 
    }
}, { 
    collection: 'tbl_users' 
});

UserSchema.pre('save', function(next) {
    this.updated_at = moment().add(7, 'hours').toDate();
    next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
