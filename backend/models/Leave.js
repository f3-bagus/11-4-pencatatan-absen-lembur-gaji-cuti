const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    nip: { 
        type: String, 
        default: null
    },
    start_date: {
        type: Date,
        default: () => {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0); 
            return startOfDay;
        }
    },
    end_date: {
        type: Date,
        default: () => {
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999); 
            return endOfDay;
        }
    },
    type: { 
        type: String, 
        enum: ["permit", "sick", "leave"],
        default: "leave" 
    },
    reason: {
        type: String,
        default: "Ada keperluan/kepentingan"
    },
    status_leave: { 
        type: String, 
        enum: ["approved", "rejected", "pending"],
        default: "pending" 
    },
    leave_letter: {
        type: String,
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
    collection: 'tbl_leaves' 
});

LeaveSchema.pre('save', function(next) {
    if (this.start_date) {
        this.start_date.setHours(0, 0, 0, 0);
    }

    if (this.end_date) {
        this.end_date.setHours(23, 59, 59, 999);
    }

    this.updated_at = Date.now();
    next();
});
const LeaveModel = mongoose.model("Leave", LeaveSchema);
module.exports = LeaveModel;