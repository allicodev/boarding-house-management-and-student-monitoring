import Establishment from "../../../database/models/Establishment";
import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    var re = new RegExp(req.query.search.trim(), "i");

    let data = await User.find({
      $or: [
        { firstName: { $regex: re } },
        { lastName: { $regex: re } },
        { email: { $regex: re } },
        { phoneNumber: { $regex: re } },
        { idNumber: { $regex: re } },
        { college: { $regex: re } },
        { course: { $regex: re } },
        { year: { $regex: re } },
      ],
    });

    console.log(data);

    res.json({
      status: 200,
      data,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
