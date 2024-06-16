const moment = require('moment-timezone');
const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({    
    nip: { 
        type: String, 
        required: true 
    },
    date: {
        type: Date,
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
    deduction_absent: {
        type: Number,
        default: null
    },
    deduction_late: {
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
        default: () => moment().toDate() 
    },
    updated_at: { 
        type: Date, 
        default: () => moment().toDate() 
    }
}, { 
    collection: 'tbl_payrolls' 
});

PayrollSchema.pre('save', function(next) {
    this.updated_at = moment().toDate();
    next();
});

const PayrollModel = mongoose.model("Payroll", PayrollSchema);
module.exports = PayrollModel;
