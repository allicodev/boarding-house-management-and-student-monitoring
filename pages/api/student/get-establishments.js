import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let { barangay, type } = req.query;
    if (barangay) barangay = new RegExp(barangay, "i");
    if (type) type = JSON.parse(type);

    const establishment = await Establishment.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $last: "$verification.status" }, "approved"] },
          ...(barangay ? { address: { $regex: barangay } } : {}),
          ...(type
            ? {
                type: {
                  $elemMatch: {
                    $in: type,
                  },
                },
              }
            : {}),
        },
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
          as: "tenants",
        },
      },
      {
        $addFields: {
          totalOccupied: { $size: "$tenants" },
        },
      },
      {
        $unset: "tenants",
      },
      {
        $unwind: "$ownerId",
      },
    ]);

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
