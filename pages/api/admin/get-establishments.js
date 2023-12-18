import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";
import mongoose, { mongo } from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const { status, id, ownerId, name } = req.query;
    let query = {};

    if (status)
      query.$expr = {
        $eq: [{ $last: "$verification.status" }, status],
      };
    if (id)
      query = {
        _id: mongoose.Types.ObjectId(id),
      };

    if (ownerId) query["ownerId"] = mongoose.Types.ObjectId(ownerId);
    if (name) query["name"] = name;

    const establishment = await Establishment.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerId",
        },
      },
      {
        $lookup: {
          from: "tenants",
          localField: "_id",
          foreignField: "establishmentId",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "studentId",
                foreignField: "_id",
                pipeline: [
                  {
                    $match: {
                      role: "student",
                    },
                  },
                ],
                as: "student",
              },
            },
            {
              $unwind: "$student",
            },
          ],
          as: "tenants",
        },
      },
      {
        $addFields: {
          totalOccupied: { $size: "$tenants" },
        },
      },
      {
        $unwind: "$ownerId",
      },
    ]);

    res.json({
      data: establishment,
      status: 200,
      message: "Fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
