const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');
const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    nip: { 
        type: String, 
        default: null
    },
    start_date: {
        type: Date,
        default: () => {
            return moment().startOf('day').toDate();
        }
    },
    end_date: {
        type: Date,
        default: () => {
            return moment().endOf('day').toDate();
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
        default: () => moment().toDate() 
    },
    updated_at: { 
        type: Date, 
        default: () => moment().toDate() 
    }
}, { 
    collection: 'tbl_leaves' 
});

LeaveSchema.pre('save', function(next) {
    if (this.start_date) {
        this.start_date = moment(this.start_date).startOf('day').toDate();
    }

    if (this.end_date) {
        this.end_date = moment(this.end_date).endOf('day').toDate();
    }

    this.updated_at = moment().toDate();
    next();
});

const LeaveModel = mongoose.model("Leave", LeaveSchema);
module.exports = LeaveModel;
