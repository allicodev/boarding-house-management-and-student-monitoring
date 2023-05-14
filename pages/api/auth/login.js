import dbConnect from "../../../database/dbConnect";
import User from "../../../database/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_PRIVATE_KEY = "okay";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { email, password } = req.body;

  if (method === "POST") {
    const validUser = await User.findOne({ email }).lean();

    if (validUser) {
      const validPassword = bcrypt.compare(password, validUser.password);

      if (validPassword) {
        const token = jwt.sign(validUser, JWT_PRIVATE_KEY);
        res.status(200).json({ jwt: token, userData: validUser });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(404).json({ success: false });
  }
}
