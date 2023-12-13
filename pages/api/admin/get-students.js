import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();
    let { college, course, barangay } = req.query;

    if (barangay) barangay = new RegExp(barangay, "i");

    let students = await User.aggregate([
      {
        $match: {
          $and: [
            { role: "student" },
            { college: { $exists: true } },
            college != null
              ? {
                  college,
                }
              : {},
            course != null
              ? {
                  course,
                }
              : {},
          ],
        },
      },
      {
        $lookup: {
          from: "tenants",
          localField: "_id",
          foreignField: "studentId",
          pipeline: [
            {
              $lookup: {
                from: "establishments",
                localField: "establishmentId",
                foreignField: "_id",
                pipeline:
                  barangay != null
                    ? [
                        {
                          $match: {
                            address: { $regex: barangay },
                          },
                        },
                      ]
                    : [],

                as: "establishmentId",
              },
            },
            {
              $unwind: "$establishmentId",
            },
          ],
          as: "tenant",
        },
      },
      {
        $unwind: {
          path: "$tenant",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (barangay)
      students = students.filter(
        (e) => e?.tenant != null && e.tenant?.length != 0
      );

    res.json({
      status: 200,
      message: "Fetched successfully",
      students,
    });
    // });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
