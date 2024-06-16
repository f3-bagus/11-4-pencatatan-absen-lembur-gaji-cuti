const moment = require('moment-timezone');
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({    
    nip: { 
        type: String, 
        required: true 
    },
    date: {
        type: Date,
        default: null
    },
    clock_in: {
        type: String,
        default: null
    },
    clock_out: {
        type: String,
        default: null
    },
    status_attendance: { 
        type: String, 
        enum: ["present", "late", "absent", "sick", "leave", "permit", "clock in ok", "clock in late", "clock in ok without clock out", "clock in late without clock out", null],
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
    collection: 'tbl_attendances' 
});

AttendanceSchema.pre('save', function(next) {
    if (this.date) {
        this.date.setHours(0, 0, 0, 0);
    }
    
    this.updated_at = Date.now();
    next();
});

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
module.exports = AttendanceModel;
