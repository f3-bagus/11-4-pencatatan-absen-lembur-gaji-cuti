const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({    
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
    email: String,
    phone: String,
    type: { 
        type: String, 
        enum: ["permanent", "contract", "intern", "part_time"],
        default: "permanent" 
    },
    division: { 
        type: String, 
        enum: ["IT", "Sales", "Marketing", "Accounting"]
    },
    profile_photo: String,
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    },
    attendances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance'
    }]
}, { 
    collection: 'tbl_employees' 
});

EmployeeSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
module.exports = EmployeeModel;
