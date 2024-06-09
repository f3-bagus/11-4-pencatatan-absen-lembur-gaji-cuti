const UserModel = require('../models/User');

// Middleware untuk otorisasi (cek role)
const authorizeRole = async (req, res, next) => {
    try {
      // Mendapatkan data pengguna dari objek req yang telah ditambahkan oleh middleware authenticateToken
      const { nip } = req.user;
  
      // Temukan pengguna berdasarkan NIP
      const user = await UserModel.findOne({ nip });
  
      // Periksa peran pengguna dan cocokkan dengan peran yang diperlukan untuk rute
      if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
            message: 'Not Permitted' 
        });
      }
  
      // Jika pengguna memiliki peran yang sesuai, lanjutkan ke middleware berikutnya
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = {
    authorizeRole
  };
  