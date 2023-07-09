import Request from "../../../database/models/Request";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    await Request.findOneAndDelete({ _id: req.query._id });

    res.json({
      status: 200,
      message: "Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
