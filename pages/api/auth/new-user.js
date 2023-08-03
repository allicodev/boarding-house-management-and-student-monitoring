import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");
    await dbConnect();

    return await User.findOne({ email: req.body.email }).then(async (doc) => {
      if (doc)
        return res.json({
          status: 201,
          message: "Email is already taken",
        });

      req.body.password = await bcrypt.hash(req.body.password, 8);

      return await User.create(req.body).then((_doc) =>
        res.json({
          status: 200,
          user: _doc,
          message: "Registered successfully",
        })
      );
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
