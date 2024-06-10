const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    nip: { 
        type: String, 
        required: true 
    },
    start_date: Date,
    end_date: Date,
    type: { 
        type: String, 
        enum: ["izin", "sakit", "cuti"],
        default: "cuti" 
    },
    reason: String,
    status_leave: { 
        type: String, 
        enum: ["approved", "rejected", "pending"],
        default: "pending" 
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
