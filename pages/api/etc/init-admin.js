import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const { id: _id } = req.query;

    return await User.find({ role: "admin" })
      .then(async (data) => {
        if (data) {
          res.json({ status: 200, message: "Fetch done.", hasAdmin: true });
          resolve();
        } else {
          res.json({ status: 200, message: "Fetch done.", hasAdmin: false });
          let _ = User({
            firstName: "BH",
            lastName: "Finder ADMIN",
            email: "admin@email.com",
            role: "admin",
          });
          _.password = await bcrypt.hash("1234", 8);

          await _.save();
        }
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: "Error: " + err });
      });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
