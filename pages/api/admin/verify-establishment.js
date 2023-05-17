import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");

    await dbConnect();

    // status declined or 
    const { placeId, status } = req.body;

    await Establishment.findByIdAndUpdate(placeId, { $set: { status } });

    res.status(200).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}
