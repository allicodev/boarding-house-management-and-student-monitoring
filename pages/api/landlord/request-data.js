import Request from "../../../database/models/Request";
import Tenant from "../../../database/models/Tenant";
import Establishment from "../../../database/models/Establishment";
import dbConnect from "../../../database/dbConnect";
import mongoose, { mongo } from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let { type, id } = req.query;
    let data = [];

    if (!["request", "tenants", "tenants-all"].includes(type))
      throw new Error();

    let ownerId = JSON.parse(req.cookies.currentUser)._id;
    if (type === "request") {
      data = await Request.aggregate([
        {
          $match: {
            $and: [
              { status: "pending" },
              [null, undefined, ""].includes(id)
                ? {}
                : { establishmentId: mongoose.Types.ObjectId(id) },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            as: "studentId",
          },
        },
        {
          $lookup: {
            from: "establishments",
            localField: "establishmentId",
            foreignField: "_id",
            pipeline: [
              {
                $match: { ownerId: mongoose.Types.ObjectId(ownerId) },
              },
            ],
            as: "establishmentId",
          },
        },
        {
          $unwind: "$establishmentId",
        },
        {
          $unwind: "$studentId",
        },
      ]);
    } else if (type === "tenants") {
      data = await Tenant.aggregate([
        {
          $match: {
            establishmentId: mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            as: "studentId",
          },
        },
        {
          $lookup: {
            from: "establishments",
            localField: "establishmentId",
            foreignField: "_id",
            as: "establishmentId",
            pipeline: [
              {
                $match: { ownerId: mongoose.Types.ObjectId(ownerId) },
              },
            ],
          },
        },
        {
          $unwind: "$establishmentId",
        },
        {
          $unwind: "$studentId",
        },
      ]);
    } else if (type == "tenants-all") {
      const { ownerId } = req.query;

      let ids = await Establishment.aggregate([
        {
          $match: {
            ownerId: mongoose.Types.ObjectId(ownerId),
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);

      ids = ids.map((e) => e._id);
      let tenants = await Tenant.find({
        establishmentId: {
          $in: ids.map((e) => mongoose.Types.ObjectId(e)),
        },
      })
        .populate("studentId establishmentId")
        .lean();
      data = tenants.map((e) => {
        return { ...e.studentId, estabName: e.establishmentId.name };
      });
    }

    res.json({ data, status: 200 });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
