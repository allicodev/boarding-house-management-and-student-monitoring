import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "PUT") throw new Error("Invalid method");

    await dbConnect();

    const { _id } = req.body;

    await User.findByIdAndUpdate(_id, { $set: { ...req.body } });

    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}
