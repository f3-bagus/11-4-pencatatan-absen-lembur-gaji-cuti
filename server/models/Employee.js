const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({    
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
    profile_photo: String
}, { 
    collection: 'tbl_employees' 
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
module.exports = EmployeeModel;
