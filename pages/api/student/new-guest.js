import Request from "../../../database/models/Request";
import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");
    await dbConnect();

    return await User.create(req.body).then(async (doc) => {
      await Request.create({
        studentId: mongoose.Types.ObjectId(doc._id),
        establishmentId: mongoose.Types.ObjectId(req.body.establishmentId),
      });
      return res.json({
        status: 200,
        message: "Registered successfully",
      });
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
