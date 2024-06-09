const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const secretKey = require('../middleware/authenticate').secretKey;
const bcrypt = require('bcrypt');

// Method untuk membuat user baru
const createUser = async (req, res) => {
  try {
      const { nip, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
          nip,
          password: hashedPassword,
          role
      });
      
      // Simpan User baru ke dalam db
      const savedUser = await newUser.save();

      // Kirim respons dengan data user yang telah dibuat
      res.json(savedUser);
  } catch (error) {
      res.status(500).json({ 
        message: error.message 
      });
  }
};

// Method untuk login
const loginUser = async (req, res) => {
  const { nip, password } = req.body;

  try {
    // Temukan pengguna berdasarkan NIP
    const user = await UserModel.findOne({ nip });

    // Periksa apakah pengguna ditemukan
    if (!user) {
      return res.status(404).json({ 
        message: 'Pengguna tidak ditemukan' 
      });
    }

    if (!user.password) {
      return res.status(404).json({ 
        message: 'Password belum dimasukkan' 
      });
    }

    // Periksa password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const payload = {
        id: user._id,
        nip: user.nip,
        role: user.role
      };

      // Buat token JWT
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      // Kirim token sebagai respons
      return res.json({
        data: {
          nip: user.nip,
          role: user.role
        },
        token 
      });
    } else {
      // Password salah
      return res.status(401).json({ 
        message: 'Password salah' 
      });
    }

  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
};

// Method untuk logout
const logoutUser = async (req, res) => {
  try {
    // Hapus cookie yang berisi token JWT
    res.clearCookie('token');

    res.json({ 
      message: 'Logout successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Logout failed', 
      error: error.message 
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser
};
