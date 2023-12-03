import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");

    await dbConnect();
    let establishment = await Establishment.aggregate([
      {
        $match: {
          $and: [
            {
              $expr: {
                $eq: ["$ownerId", mongoose.Types.ObjectId(req.query._id)],
              },
            },
            ![null, undefined, ""].includes(req.query.name)
              ? {
                  name: req.query.name,
                }
              : {},
          ],
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
          pipeline: [
            {
              $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "studentId",
                as: "studentId",
              },
            },
            {
              $lookup: {
                from: "establishments",
                foreignField: "_id",
                localField: "establishmentId",
                as: "establishmentId",
              },
            },
            {
              $unwind: "$studentId",
            },
            {
              $unwind: "$establishmentId",
            },
          ],
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
        $unset: ["requests"],
      },
    ]);

    res.json({ establishment, status: 200, message: "Fetched successfully" });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
