const jwt = require('jsonwebtoken');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  console.log('=== Auth Middleware Debug ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Auth headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted:', token ? token.substring(0, 10) + '...' : 'No token');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) + '...' : 'Not set');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', {
      id: decoded.id,
      email: decoded.email,
      exp: new Date(decoded.exp * 1000).toLocaleString(),
      iat: new Date(decoded.iat * 1000).toLocaleString()
    });
    
    // Set user info from token
    req.user = decoded;
    console.log('User info set in request:', {
      id: req.user.id,
      email: req.user.email
    });

    next();
  } catch (err) {
    console.error('Token verification error:', {
      name: err.name,
      message: err.message,
      expiredAt: err.expiredAt ? new Date(err.expiredAt).toLocaleString() : 'N/A'
    });
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
}; 