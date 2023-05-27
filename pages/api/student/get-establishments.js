import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();
    let ownerId = JSON.parse(req.cookies.currentUser)._id;

    const establishment = await Establishment.aggregate([
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
          as: "tenants",
        },
      },
      {
        $addFields: {
          totalOccupied: { $sum: "$tenants" },
        },
      },
      {
        $unset: "tenants",
      },
      {
        $unwind: "$ownerId",
      },
    ]);

    console.log(establishment);

    res.json({
      data: establishment,
      status: 200,
      message: "Registered successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
