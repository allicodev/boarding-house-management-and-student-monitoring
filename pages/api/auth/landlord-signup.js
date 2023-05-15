import dbConnect from "../../../database/dbConnect";
import User from "../../../database/models/User";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const data = { ...req.body, role: "landlord" };

    await User.create({ ...data });

    res.status(200).json({ message: 'Added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}
