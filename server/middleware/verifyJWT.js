import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

export default verifyJWT;
