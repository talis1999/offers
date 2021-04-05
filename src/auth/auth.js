import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  console.log(token);
  if (!token) return res.status(400).json({ err: "Authorisation failed" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(400).json({ err: "Authorisation failed" });
    req.user = user;
    next();
  });
};

export default auth;
