import Tenant from "../../../database/models/Tenant";
import Archive from "../../../database/models/Archive";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE") throw new Error("Invalid method");
    await dbConnect();

    const { studentId, establishmentId, reason } = req.query;
    return await Tenant.findOneAndDelete({ studentId, establishmentId })
      .then(async () => {
        await Archive.create({ studentId, establishmentId, reason });
        return res.json({ status: 200 });
      })
      .catch(() => {
        return res.json({ status: 500, success: false, message: err });
      });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
