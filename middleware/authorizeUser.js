function authorizeAdminUser(req, res, next) {
  if (req.user.roles.some(role => role.user_role === "admin")) {
    next();
  } else {
    res.status(403).send({ message: "User is unauthorized" });
  }
}

export { authorizeAdminUser };
