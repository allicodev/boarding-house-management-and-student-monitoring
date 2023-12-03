import Archive from "../../../database/models/Archive";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");

    await dbConnect();
    let archiveStudent = await Archive.find({
      establishmentId: req.query.establishmentId,
    }).populate("studentId");

    res.json({ archiveStudent, status: 200, message: "Fetched successfully" });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
