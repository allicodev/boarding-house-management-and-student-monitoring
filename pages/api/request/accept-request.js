import Request from "../../../database/models/Request";
import Tenant from "../../../database/models/Tenant";
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
          status: req.body.status ?? "accepted",
        },
      }
    ).then(async (e) => {
      if (![null, "", undefined].includes(req.body.studentEmail))
        await sendMail(
          "Request accepted",
          req.body.studentEmail,
          "<div>Request is accepted by the landlord/landlady</div>"
        );

      if (req.body.status != "pending")
        await Tenant.create({
          studentId: e.studentId,
          establishmentId: e.establishmentId,
        });
    });

    res.json({
      status: 200,
      message: "Confirmed Successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
