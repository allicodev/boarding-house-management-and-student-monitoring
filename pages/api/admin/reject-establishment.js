import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    const { _id } = req.query;

    return await Establishment.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: "declined",
        },
      }
    ).then(() => {
      res.json({
        status: 200,
        message: "Declined successfully",
      });
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
