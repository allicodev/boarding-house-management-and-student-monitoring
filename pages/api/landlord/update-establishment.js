import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");
    await dbConnect();

    const { id } = req.body;
    delete req.body.id;

    return await Establishment.findByIdAndUpdate(
      { _id: id },
      { $set: req.body }
    ).then(() => res.json({ status: 200, message: "Updated successfully" }));
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
