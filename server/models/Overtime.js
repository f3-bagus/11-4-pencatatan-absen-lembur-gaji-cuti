const mongoose = require('mongoose');

const OvertimeSchema = new mongoose.Schema({    
    id: { 
        type: String, 
        unique: true, 
        required: true 
    },
    nip: String,
    division: { 
        type: String, 
        enum: ["IT", "Sales", "Marketing", "Accounting"]
    },
    date: Date,
    hours: Number,
    reason: String,
    status_overtime: { 
        type: String, 
        enum: ["available", "taken", "overdue"],
        default: "available" 
    },
    overtime_rate: Number,
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    collection: 'tbl_overtimes' 
});

OvertimeSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const OvertimeModel = mongoose.model("Overtime", OvertimeSchema);
module.exports = OvertimeModel;
