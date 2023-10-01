import Establishment from "../../../database/models/Establishment";
import User from "../../../database/models/User";
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

    res.json({
      status: 200,
      message: "Verified successfully",
      data: {
        totalEstablishmentUnverified,
        totalEstablishmentVerified,
        totalStudent,
        totalLandlord,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
