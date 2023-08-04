import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import dbConnect from "../../../database/dbConnect";
import Establishment from "../../../database/models/Establishment";
import User from "../../../database/models/User";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const { estabId, userId, password } = req.query;

    return await User.findOne({ _id: mongoose.Types.ObjectId(userId) }).then(
      async (doc) => {
        if (!doc) res.json({ status: 500, success: false, message: err });
        const validPassword = await bcrypt.compare(password, doc.password);

        if (validPassword) {
          return await Establishment.findOneAndDelete({ estabId }).then(() =>
            res.json({
              status: 200,
              message: `Successfully deleted`,
            })
          );
        } else res.json({ status: 401, message: "Password is wrong." });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
