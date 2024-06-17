const multer = require('multer');
const path = require('path');

//* Import Controller *//
const LeaveModel = require('../models/Leave');

//* All Method *//
/* All User: Handle Upload File Photo Profile */
const profilePhotoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile_photo');
    },
    filename: function (req, file, cb) {
        const date = Date.now();
        const filename = `profile_${date}_${file.originalname}`;
        cb(null, filename);
    }
});
const uploadProfilePhoto = multer({ storage: profilePhotoStorage });

/* Employee: Handle Upload File Leave Letter */
const leaveLetterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/leave_letter');
    },
    filename: function (req, file, cb) {
        const date = Date.now();
        const filename = `leaveletter_${date}_${file.originalname}`;
        cb(null, filename);
    }
});
const uploadLeaveLetter = multer({ storage: leaveLetterStorage });

/* Admin & HR : Download File Leave Letter */
const downloadLeaveLetter = async (req, res) => {
    const { leaveId } = req.params; 

    try {
        const leave = await LeaveModel.findById(leaveId);

        if (!leave) {
            return res.status(404).json({ 
                message: "Leave not found" 
            });
        }

        const filename = leave.leave_letter;

        if (!filename) {
            return res.status(404).json({ 
                message: "Leave letter not found" 
            });
        }

        const filePath = path.join(__dirname, '../public/uploads/leave_letter', filename);

        res.download(filePath, (err) => {
            if (err) {
                res.status(500).send({
                    message: "File not found or error occurred",
                    error: err.message,
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            error: error.message,
        });
    }
};


module.exports = { 
    uploadProfilePhoto,
    uploadLeaveLetter,
    downloadLeaveLetter
};
