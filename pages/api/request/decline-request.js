import Request from "../../../database/models/Request";
import dbConnect from "../../../database/dbConnect";
import { sendMail } from "../../../services/mailer";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Invalid method");
    await dbConnect();

    await Request.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          status: "rejected",
          declineReason: req.body.declineReason,
        },
      }
    );

    if (![null, "", undefined].includes(req.body.studentEmail))
      await sendMail(
        "Request declined",
        req.body.studentEmail,
        "<div>Request is declined by the landlord/landlady</div>"
      );
    res.json({
      status: 200,
      message: "Rejected Successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
