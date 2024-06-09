const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({    
    id: { 
        type: String, 
        unique: true, 
        required: true 
    },
    nip: { 
        type: String, 
        required: true 
    },
    month: String,
    basic_salary: Number,
    overtime_salary: Number,
    deduction_permission: Number,
    deduction_sick: Number,
    deduction_absent: Number,
    total_salary: Number,
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    collection: 'tbl_salarys' 
});

SalarySchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const SalaryModel = mongoose.model("Salary", SalarySchema);
module.exports = SalaryModel;
