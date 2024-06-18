const moment = require('moment');
const mongoose = require('mongoose');

const OvertimeSchema = new mongoose.Schema({    
    nip: { 
        type: String, 
        default: null
    },
    division: { 
        type: String, 
        enum: ["it", "sales", "marketing", "accounting"]
    },
    date: {
        type: Date,
        default: () => moment().add(7, 'hours').toDate()
    },
    hours: {
        type: Number, 
        default: null
    },
    reason: {
        type: String, 
        default: null
    },
    status_overtime: { 
        type: String, 
        enum: ["available", "taken", "overdue"],
        default: "available" 
    },
    overtime_rate: {
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
        default: () => moment().add(7, 'hours').toDate() 
    },
    updated_at: { 
        type: Date, 
        default: () => moment().add(7, 'hours').toDate()
    }
}, {
    collection: 'tbl_overtimes' 
});

OvertimeSchema.pre('save', function(next) {
    this.updated_at = moment().add(7, 'hours').toDate();
    next();
});

const OvertimeModel = mongoose.model("Overtime", OvertimeSchema);
module.exports = OvertimeModel;
