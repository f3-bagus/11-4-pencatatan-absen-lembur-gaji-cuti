const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({    
    id: { 
        type: String, 
        unique: true, 
        required: true 
    },
    nip: { 
        type: String, 
        required: true 
    },
    date: date,
    check_in: time,
    check_out: time,
    status_attendance: { 
        type: String, 
        enum: ["present", "late", "absent", "sick", "leave", "permission", "early", "late_and_early"],
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
