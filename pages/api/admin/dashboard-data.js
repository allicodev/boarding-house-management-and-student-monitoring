import Establishment from "../../../database/models/Establishment";
import User from "../../../database/models/User";
import Tenant from "../../../database/models/Tenant";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let totalEstablishmentUnverified = await Establishment.countDocuments({
      $expr: { $eq: [{ $last: "$verification.status" }, "pending"] },
    });
    let totalEstablishmentVerified = await Establishment.countDocuments({
      $expr: { $eq: [{ $last: "$verification.status" }, "approved"] },
    });
    let totalStudent = await User.countDocuments({ role: "student" });
    let totalLandlord = await User.countDocuments({ role: "landlord" });

    var sumpong = new RegExp("sumpong", "i");
    var kalasungay = new RegExp("kalasungay", "i");
    var casisang = new RegExp("casisang", "i");

    let tenants = await Tenant.aggregate([
      {
        $lookup: {
          from: "establishments",
          localField: "establishmentId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                address: { $regex: casisang },
              },
            },
          ],
          as: "casisang_tenants",
        },
      },
      {
        $addFields: {
          casisang: { $size: "$casisang_tenants" },
        },
      },
      {
        $lookup: {
          from: "establishments",
          localField: "establishmentId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                address: { $regex: sumpong },
              },
            },
          ],
          as: "sumpong_tenants",
        },
      },
      {
        $addFields: {
          sumpong: { $size: "$sumpong_tenants" },
        },
      },
      {
        $lookup: {
          from: "establishments",
          localField: "establishmentId",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                address: { $regex: kalasungay },
              },
            },
          ],
          as: "kalasungay_tenants",
        },
      },
      {
        $addFields: {
          kalasungay: { $size: "$kalasungay_tenants" },
        },
      },
      {
        $project: {
          _id: 0,
          sumpong: 1,
          casisang: 1,
          kalasungay: 1,
        },
      },
    ]);

    res.json({
      status: 200,
      message: "Verified successfully",
      data: {
        totalEstablishmentUnverified,
        totalEstablishmentVerified,
        totalStudent,
        totalLandlord,
        tenantsCount: tenants[0],
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
