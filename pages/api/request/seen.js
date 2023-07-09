import Request from "../../../database/models/Request";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();
    console.log(req.query);
    await Request.findOneAndUpdate(
      { _id: req.query._id },
      {
        $set: {
          seen: true,
        },
      }
    );

    res.json({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
