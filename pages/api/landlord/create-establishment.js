import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");
    await dbConnect();
    if (req.body?.signature != null)
      req.body.signature = Buffer.from(req.body.signature, "base64");

    let newEstablishment = Establishment(req.body);
    newEstablishment.ownerId = mongoose.Types.ObjectId(req.body.ownerId);
    await newEstablishment.save();

    res.json({ status: 200, message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
