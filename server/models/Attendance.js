const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({    
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    nip: { 
        type: String, 
        required: true 
    },
    clock_in: {
        type: Date,
        default: null
    },
    clock_out: {
        type: Date,
        default: null
    },
    status_attendance: { 
        type: String, 
        enum: ["present", "late", "absent", "sick", "leave", "permit", "clock-in ok", "clock in late", "clock in without clock out"],
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
    collection: 'tbl_attendances' 
});

AttendanceSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
module.exports = AttendanceModel;
