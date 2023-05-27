import dbConnect from "../../../database/dbConnect";
import Establishment from "../../../database/models/Establishment";
import Tenant from "../../../database/models/Tenant";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const _id = req.query.id;

    await Establishment.findOneAndDelete({ _id });
    res.json({
      status: 200,
      message: `Successfully fetch`,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
