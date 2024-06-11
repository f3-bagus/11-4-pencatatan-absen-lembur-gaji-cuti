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
    month: String,
    basic_salary: Number,
    overtime_salary: Number,
    deduction_permission: Number,
    deduction_sick: Number,
    deduction_absent: Number,
    total_salary: Number,
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
