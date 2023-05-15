import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");

    await dbConnect();

    const { idNumber, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ idNumber }).lean();

    if (!user) throw new Error("Invalid user");

    if (await bcrypt.compare(oldPassword, user?.password)) {
      await User.findOneAndUpdate(
        { idNumber },
        { $set: { password: await bcrypt.hash(newPassword, 8) } }
      );
      res.status(200).json({ message: "Registered successfully" });
    } else {
      res.status(500).json({ message: "Password didnt match" });
    }
  } catch (err) {
    console.log('ERR', err);
    res.status(500).json({ success: false, message: err });
  }
}
