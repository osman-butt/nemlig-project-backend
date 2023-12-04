import bcrypt from "bcrypt";
import authModel from "./authModel.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "./authUtils.js";
import { v4 as uuidv4 } from "uuid";

async function registerUser(req, res) {
  // Extract body
  const { user_email, user_password, customer } = req.body;
  const { customer_name, addresses } = customer;
  const { street, city, zip_code, country } = addresses;

  if (customer_name.length < 2) {
    return res.status(400).json({ message: "Mangler navn" });
  }

  if (street.length < 2) {
    return res.status(400).json({ message: "Ugyldig addresse" });
  }

  if ((zip_code < 1301) | (zip_code > 9990)) {
    return res.status(400).json({ message: "Ugyldigt postnummer" });
  }

  if (city.length < 2) {
    return res.status(400).json({ message: "Ugyldig by" });
  }

  if (user_password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password for kort (min 6 karakterer)" });
  }

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
  if ((email == undefined) | (password == undefined))
    return res.status(403).send({ message: "Email or password is missing" });

  // Check if user exists in db
  const userArray = await authModel.getUsersSearch(email.toLowerCase());
  const user = userArray[0];
  if (user == null) {
    return res.status(400).send({ message: "Wrong email or password" });
  }
  try {
    // Check if password is correct
    if (await bcrypt.compare(password, user.user_password)) {
      // The JWT only stores enough info for the client app
      // to identify the user and it's permissions
      const userJWTAccess = {
        user_email: user.user_email,
        user_roles: user.roles.map(role => role.user_role).flat(),
      };
      const userJWTRefresh = {
        user_email: user.user_email,
        user_roles: user.roles.map(role => role.user_role).flat(),
        uid: uuidv4(), // for looking up in db
      };
      const accessToken = generateAccessToken(userJWTAccess);
      const refreshToken = generateRefreshToken(userJWTRefresh);
      await authModel.setUserToken(userJWTRefresh.uid, user.user_id);
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false, // Set to false for HTTP in development
        withCredentials: true,
        sameSite: "Lax", // Use Lax instead of None in development
        maxAge: 30 * 60 * 1000, // valid for 30min
      });
      res.status(200).send({ accessToken: accessToken });
    } else {
      res.status(403).send({ message: "Wrong email or password" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function logoutUser(req, res) {
  // GET COOKIE
  const cookies = req.cookies;
  const refreshToken = cookies && cookies?.jwt;
  if (refreshToken == null) return res.sendStatus(204); //No content
  // Remove cookie from header
  res.clearCookie("jwt", { httpOnly: true, secure: true });
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403); // Forbidden
      console.log(decoded);
      // Find user with that refreshToken
      const user = await authModel.getUserToken(decoded.uid);
      if (!user) return res.sendStatus(403); //Forbidden
      // DELETE Refresh token from db
      await authModel.deleteUserToken(decoded.uid);
    }
  );
  res.sendStatus(204);
}

async function refreshToken(req, res) {
  // GET COOKIE
  const cookies = req.cookies;
  // CHECK IF IT HAS jwt else res.sendStatus(401) //unauthorized
  const refreshToken = cookies && cookies?.jwt;
  if (refreshToken == null) return res.status(401).send();
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  try {
    // Verify token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden
        console.log(decoded);
        // Find user with that refreshToken
        const user = await authModel.getUserToken(decoded.uid);
        if (!user) return res.sendStatus(403); //Forbidden

        // DELETE Refresh token from db
        await authModel.deleteUserToken(decoded.uid);
        const userJWTAccess = {
          user_email: decoded.user_email,
          user_roles: decoded.user_roles,
        };
        const userJWTRefresh = {
          user_email: user.user_email,
          user_roles: decoded.user_roles,
          uid: uuidv4(), // for looking up in db
        };
        const accessToken = generateAccessToken(userJWTAccess);
        const refreshToken = generateRefreshToken(userJWTRefresh);
        await authModel.setUserToken(userJWTRefresh.uid, user.user_id);
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true, // Set to true for HTTPS
          sameSite: "None",
          maxAge: 30 * 60 * 1000, // valid for 30min
        });
        res.send({ accessToken: accessToken });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
}

export default { registerUser, loginUser, logoutUser, refreshToken };
