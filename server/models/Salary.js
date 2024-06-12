const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({    
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    nip: { 
        type: String, 
        required: true 
    },
    month: {
        type: String,
        default: null
    },
    basic_salary: {
        type: Number,
        default: null
    },
    overtime_salary: {
        type: Number,
        default: null
    },
    deduction_permission: {
        type: Number,
        default: null
    },
    deduction_sick: {
        type: Number,
        default: null
    },
    deduction_absent: {
        type: Number,
        default: null
    },
    total_salary: {
        type: Number,
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
    collection: 'tbl_salaries' 
});

SalarySchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const SalaryModel = mongoose.model("Salary", SalarySchema);
module.exports = SalaryModel;
