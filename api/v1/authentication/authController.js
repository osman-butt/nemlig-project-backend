import bcrypt from "bcrypt";
import authModel from "./authModel.js";
import { generateAccessToken } from "./authUtils.js";

async function registerUser(req, res) {
  // Extract body
  const { user_email, user_password, customer } = req.body;
  const { customer_name, addresses } = customer;
  const { street, city, zip_code, country } = addresses;

  // Hash password for db
  const hashedPass = await bcrypt.hash(user_password, 10);
  try {
    // Check if user exists
    const usersMatch = await authModel.getUsersSearch(user_email.toLowerCase());
    if (usersMatch.length > 0)
      return res.status(409).json({ message: "User already exists." });

    // Save user in db
    await authModel.setUserCustomer(
      user_email.toLowerCase(),
      hashedPass,
      customer_name,
      street,
      city,
      zip_code,
      country
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  // Check if body contains email and password
  if ((email == undefined) | (email == undefined))
    return res.status(403).send({ message: "Email or password is missing" });
  // Check if user exists in db
  const userArray = await authModel.getUsersSearch(email.toLowerCase());
  const user = userArray[0];
  if (user == null) {
    return res.status(400).send({ message: "Wrong email or password" });
  }
  try {
    if (await bcrypt.compare(password, user.user_password)) {
      const accessToken = generateAccessToken(user);
      res.cookie("jwtToken", accessToken, {
        httpOnly: true,
        secure: true, // Set to true for HTTPS
      });
      res.status(200).send();
    } else {
      res.status(403).send({ message: "Wrong email or password" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function logoutUser(req, res) {
  res.clearCookie("jwtToken", { httpOnly: true, secure: true });
  res.sendStatus(204);
}

export default { registerUser, loginUser, logoutUser };
