const moment = require('moment');
const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    nip: { 
        type: String, 
        default: null
    },
    start_date: {
        type: Date,
        default: () => {
            return moment().startOf('day').add(7, 'hours').toDate();
        }
    },
    end_date: {
        type: Date,
        default: () => {
            return moment().endOf('day').add(7, 'hours').toDate();
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
        default: () => moment().add(7, 'hours').toDate() 
    },
    updated_at: { 
        type: Date, 
        default: () => moment().add(7, 'hours').toDate() 
    }
}, { 
    collection: 'tbl_leaves' 
});

LeaveSchema.pre('save', function(next) {
    this.updated_at = moment().add(7, 'hours').toDate();
    next();
});

const LeaveModel = mongoose.model("Leave", LeaveSchema);
module.exports = LeaveModel;
