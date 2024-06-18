const moment = require('moment');
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({    
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
    type: { 
        type: String, 
        enum: ["permanent", "contract", "intern"],
        default: "permanent" 
    },
    division: { 
        type: String, 
        enum: ["it", "sales", "marketing", "accounting"],
        default: "sales"
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
        default: moment().add(7, 'hours').toDate()
    },
    updated_at: { 
        type: Date, 
        default: moment().add(7, 'hours').toDate()
    }
}, { 
    collection: 'tbl_employees' 
});

EmployeeSchema.pre('save', function(next) {
    this.updated_at = moment().add(7, 'hours').toDate();
    next();
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
module.exports = EmployeeModel;
