const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    nip: { 
        type: String, 
        required: true 
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
    reason: String,
    status_leave: { 
        type: String, 
        enum: ["approved", "rejected", "pending"],
        default: "pending" 
    },
    leave_letter: {
        type: String,
        required: true,
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
    this.updated_at = Date.now();
    next();
});

const LeaveModel = mongoose.model("Leave", LeaveSchema);
module.exports = LeaveModel;