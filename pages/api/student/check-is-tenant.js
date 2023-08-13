import Request from "../../../database/models/Request";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const { studentId } = req.query;

    return await Request.findOne({ studentId, status: "accepted" }).then(
      (doc) => {
        if (doc != null)
          return res.json({
            status: 200,
          });

        return res.json({
          status: 201,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
