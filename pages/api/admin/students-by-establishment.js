import Tenant from "../../../database/models/Tenant";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let { placeId } = req.query;
    let students = await Tenant.find({ establishmentId: placeId }).populate(
      "studentId establishmentId"
    );

    res.json({
      status: 200,
      message: "Fetched successfully",
      students,
    });
    // });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
