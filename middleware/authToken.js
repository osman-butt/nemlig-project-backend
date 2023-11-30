import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  // const authHeader = req.headers["authorization"];
  const authHeader = req.headers["cookie"];
  // const token = authHeader && authHeader.split(" ")[1];
  const token = authHeader && authHeader.split("=")[1];
  if (token == null) return res.status(401).send();
  // Verify token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    { algorithms: ["RS256", "HS256"] },
    (err, user) => {
      if (err) return res.status(403).send({ message: "User is unauthorized" });
      req.user = user;
      next();
    }
  );
}

export { authenticateToken };
