import Request from "../../../database/models/Request";
import dbConnect from "../../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");
    await dbConnect();
    let newRequest = Request({
      studentId: mongoose.Types.ObjectId(req.body.studentId),
      establishmentId: mongoose.Types.ObjectId(req.body.establishmentId),
    });
    await newRequest.save();

    res.json({
      status: 200,
      message: "Request has been sent.",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
