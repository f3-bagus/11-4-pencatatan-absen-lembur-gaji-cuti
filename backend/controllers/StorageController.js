const multer = require('multer');
const path = require('path');

/* All User: Handle Upload File Photo Profile */
const profilePhotoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile_photo');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const uploadProfilePhoto = multer({ storage: profilePhotoStorage });

/* Employee: Handle Upload File Leave Letter */
const leaveLetterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/leave_letter');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const uploadLeaveLetter = multer({ storage: leaveLetterStorage });

module.exports = { 
    uploadProfilePhoto,
    uploadLeaveLetter
};
