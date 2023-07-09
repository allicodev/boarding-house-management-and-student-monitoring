import Request from "../../../database/models/Request";
import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let request = await Request.find(
      req.query.hasOwnProperty("studentId")
        ? { studentId: req.query.studentId }
        : { establishmentId: req.query.establishmentId }
    )
      .populate({
        path: "establishmentId",
        populate: {
          path: "ownerId",
        },
      })
      .populate("studentId");

    res.json({
      status: 200,
      message: "Request has been sent.",
      data: request,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
