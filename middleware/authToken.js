import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  // Check header for Bearer JWT token
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  // Verify token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    { algorithms: ["RS256", "HS256"] },
    (err, user) => {
      if (err) return res.status(403).send({ message: "User is unauthorized" });
      req.user_email = user.user_email;
      req.user_roles = user.user_roles;
      req.isMember = user.user_roles.includes("member");
      next();
    }
  );
}

export { authenticateToken };
