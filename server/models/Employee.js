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
        enum: ["Male", "Female"],
        default: "Male"
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
        enum: ["IT", "Sales", "Marketing", "Accounting"],
        default: "Sales"
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
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    collection: 'tbl_employees' 
});

EmployeeSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
module.exports = EmployeeModel;
