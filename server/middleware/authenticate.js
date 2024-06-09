const jwt = require('jsonwebtoken');
const secretKey = '639AqKEkrQjms2grEgcFTRP60m67jGSjrCeOZteT8R';

// Middleware untuk memverifikasi token JWT
const authenticateToken = async (req, res, next) => {
  // Mendapatkan token dari header 'Authorization'
  const authHeader = req.headers.authorization;
  
  // Jika token tidak tersedia
  if (!authHeader) {
    return res.status(401).json({ message: 'Token diperlukan' });
  }

  try {
    // Mendapatkan token dari header dengan memisahkan "Bearer" dari token itu sendiri
    const token = authHeader.split(' ')[1];
  
    // Verifikasi token JWT
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
      }
      // Jika token valid, tambahkan data pengguna ke objek req untuk digunakan di middleware berikutnya
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    authenticateToken,
    secretKey
}