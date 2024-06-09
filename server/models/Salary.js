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
    created_at: Date,
    updated_at: Date
}, { 
    collection: 'tbl_salarys' 
});

const SalaryModel = mongoose.model("Salary", SalarySchema);
module.exports = SalaryModel;
