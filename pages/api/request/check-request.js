import Request from "../../../database/models/Request";
import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const { studentId, establishmentId } = req.query;

    return await Request.findOne({ studentId, establishmentId }).then((doc) => {
      if (doc != null) {
        return res.json({
          status: 200,
          request: doc.status,
        });
      }
      return res.json({
        status: 400,
      });
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
