import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");

    await dbConnect();

    const { id, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: id }).lean();

    if (!user) throw new Error("Invalid user");

    if (await bcrypt.compare(oldPassword, user?.password)) {
      let _newPassword = await bcrypt.hash(newPassword, 8);
      await User.findOneAndUpdate(
        { _id: id },
        { $set: { password: _newPassword } }
      );
      res.json({ status: 200, message: "Password Updated Successfully" });
    } else {
      res.json({ status: 401, message: "Old Password is wrong" });
    }
  } catch (err) {
    console.log("ERR", err);
    res.json({ success: false, message: err });
  }
}
