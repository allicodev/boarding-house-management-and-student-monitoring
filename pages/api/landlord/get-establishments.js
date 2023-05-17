import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");

    await dbConnect();
    let establishment = await Establishment.find({
      ownerId: req.query._id,
    });

    res.json({ establishment, status: 200, message: "Fetched successfully" });
  } catch (err) {
    res.json({ status: 500, success: false, message: err });
  }
}
