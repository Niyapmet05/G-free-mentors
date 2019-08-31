import jwt from 'jsonwebtoken';

const checkToken = (req, res, next) => {
  //creating token
  const token = req.headers['token'] || req.body['token'] || null;

  if (!token) {
    return res.status(401).json({
      error: 'Please, Authentication is required!',
    });
  }
  //verfying token
  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        error: 'Failed to authenticate token',
      });
    }
    req.decodedToken = decoded || null;
    next();
    return true;
  });
  return true;
};

export default checkToken;//for external use