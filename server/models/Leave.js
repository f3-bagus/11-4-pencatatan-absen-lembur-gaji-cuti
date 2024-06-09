const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({    
    id: { 
        type: String, 
        unique: true, 
        required: true 
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
    }
}, { 
    collection: 'tbl_leaves' 
});

const LeaveModel = mongoose.model("Leave", LeaveSchema);
module.exports = LeaveModel;
