import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') throw new Error('Invalid method');

    await dbConnect();
    const data = await Establishment.find({ status: "pending" });

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}
