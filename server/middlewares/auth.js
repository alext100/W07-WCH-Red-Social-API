const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new Error("Error of authorization!");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("Token is incorrect");
      error.code = 401;
      next(error);
    } else {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = user.id;
        next();
      } catch {
        const error = new Error("Error of verify");
        error.code = 401;
        next(error);
      }
    }
  }
};

module.exports = auth;
