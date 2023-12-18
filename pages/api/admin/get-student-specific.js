import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let { id } = req.query;
    let student = await User.findOne({ role: "student", _id: id });

    res.json({
      status: 200,
      message: "Fetched successfully",
      student,
    });
    // });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
