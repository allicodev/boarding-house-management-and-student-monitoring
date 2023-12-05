import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const { id: _id } = req.query;

    return await User.findOne({ _id }).then((doc) => {
      if (doc != null)
        return res.json({
          status: 200,
          user: doc,
        });

      return res.json({
        status: 201,
      });
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
