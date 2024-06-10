const jwt = require('jsonwebtoken');
const secretKey = '639AqKEkrQjms2grEgcFTRP60m67jGSjrCeOZteT8R';
const UserModel = require('../models/User');

// Authentication Token JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'Token diperlukan' 
    });
  }

  try {
    const token = authHeader.split(' ')[1];
  
    // Verifikasi token JWT
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          message: 'Token tidak valid' 
        });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
};

// Authorization Role
const authorizeRole = async (req, res, next) => {
    try {
      const { nip } = req.user;
  
      const user = await UserModel.findOne({ nip });
  
      if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
            message: 'Not Permitted' 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        message: error.message 
      });
    }
};

const login = async (req, res) => {
    const { nip, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ nip });
  
      if (!user) {
        return res.status(404).json({ 
          message: 'User Not Found' 
        });
      }
  
      if (!user.password) {
        return res.status(404).json({ 
          message: 'Password Required' 
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (isPasswordValid) {
        const payload = {
          id: user._id,
          nip: user.nip,
          role: user.role
        };
  
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  
        return res.json({
          data: {
            nip: user.nip,
            role: user.role
          },
          token 
        });
      } else {
        return res.status(401).json({ 
          message: 'Wrong Password' 
        });
      }
  
    } catch (error) {
      res.status(500).json({ 
        message: error.message 
      });
    }
};
  
  // Method untuk logout
  const logout = async (req, res) => {
    try {
      // Hapus cookie yang berisi token JWT
      res.clearCookie('token');
  
      res.json({ 
        message: 'Logout Successful' 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Logout Failed', 
        error: error.message 
      });
    }
};

module.exports = {
    authenticateToken,
    authorizeRole,
    login,
    logout,
    secretKey
}