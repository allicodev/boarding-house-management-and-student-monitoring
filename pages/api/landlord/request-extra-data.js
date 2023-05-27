import dbConnect from "../../../database/dbConnect";
import Establishment from "../../../database/models/Establishment";
import Tenant from "../../../database/models/Tenant";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let ownerId = JSON.parse(req.cookies.currentUser)._id;
    let doc = await Establishment.find({ ownerId });
    let estabId = doc.map((_) => _._id);

    let totalOccupied = await Tenant.countDocuments({ _id: { $in: estabId } });

    let total = doc.reduce((p, n) => p + n.totalSpaceForRent, 0);
    let totalVacant = total - totalOccupied;

    console.log(totalVacant);

    res.json({
      data: {
        total,
        vacant: totalVacant,
      },
      status: 200,
      message: `Successfully fetch`,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
