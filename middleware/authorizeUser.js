function authorizeAdminUser(req, res, next) {
  if (req.user_roles.some(role => role === "admin")) {
    next();
  } else {
    res.status(403).send({ message: "User is unauthorized MIDDLE" });
  }
}

export { authorizeAdminUser };
