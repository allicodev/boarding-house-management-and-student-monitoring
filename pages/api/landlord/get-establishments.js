import Establishment from "../../../database/models/Establishment";
import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");

    await dbConnect();
    let establishment = await Establishment.aggregate([
      {
        $match: {
          $expr: { $eq: ["$ownerId", mongoose.Types.ObjectId(req.query._id)] },
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "ownerId",
          as: "ownerId",
        },
      },
      {
        $unwind: "$ownerId",
      },
      {
        $lookup: {
          from: "tenants",
          foreignField: "establishmentId",
          localField: "_id",
          as: "tenants",
        },
      },
      {
        $addFields: {
          totalSpaceRented: {
            $size: "$tenants",
          },
        },
      },
      {
        $lookup: {
          from: "requests",
          foreignField: "establishmentId",
          localField: "_id",
          pipeline: [
            {
              $match: { status: "pending" },
            },
          ],
          as: "requests",
        },
      },
      {
        $addFields: {
          totalRequests: {
            $size: "$requests",
          },
        },
      },
      {
        $unset: ["tenants", "requests"],
      },
    ]);

    res.json({ establishment, status: 200, message: "Fetched successfully" });
  } catch (err) {
    res.json({ status: 500, success: false, message: err });
  }
}
