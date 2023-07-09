import mongoose from "mongoose";
import dbConnect from "../../../database/dbConnect";
import Tenant from "../../../database/models/Tenant";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let ownerId = JSON.parse(req.cookies.currentUser)._id;

    let recentTenant = await Tenant.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentId",
        },
      },
      {
        $lookup: {
          from: "establishments",
          localField: "establishmentId",
          foreignField: "_id",
          pipeline: [
            {
              $match: { ownerId: mongoose.Types.ObjectId(ownerId) },
            },
          ],
          as: "establishmentId",
        },
      },
      {
        $unwind: "$establishmentId",
      },
      {
        $unwind: "$studentId",
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json({
      data: recentTenant,
      status: 200,
      message: `Successfully fetch`,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
