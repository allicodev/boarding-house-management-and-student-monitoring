import dbConnect from "../../../database/dbConnect";
import User from "../../../database/models/User";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");
    await dbConnect();

    const { id, text, isViolation } = req.body;
    return await User.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          history: {
            text,
            isViolation,
          },
        },
      }
    ).then(() => {
      return res.json({
        status: 200,
      });
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
