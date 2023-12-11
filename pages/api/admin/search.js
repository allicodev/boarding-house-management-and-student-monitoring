import Establishment from "../../../database/models/Establishment";
import User from "../../../database/models/User";
import Tenant from "../../../database/models/Tenant";
import dbConnect from "../../../database/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();
    const { search, role, id } = req.query;
    var re = new RegExp(search.trim(), "i");
    if (role == "student") {
      let user = await User.aggregate([
        {
          $addFields: {
            fullName: { $concat: ["$firstName", " ", "$lastName"] },
          },
        },
        {
          $match: {
            $and: [
              { role: { $ne: "admin" } },
              { role: { $ne: "student" } },
              {
                $or: [
                  { firstName: { $regex: re } },
                  { lastName: { $regex: re } },
                  { fullName: { $regex: re } },
                  { email: { $regex: re } },
                  { phoneNumber: { $regex: re } },
                  { idNumber: { $regex: re } },
                  { college: { $regex: re } },
                  { course: { $regex: re } },
                  // { year: { $regex: re } },
                ],
              },
            ],
          },
        },
      ]);

      let estab = await Establishment.find({ name: { $regex: re } });

      res.json({
        status: 200,
        data: {
          user,
          estab,
        },
      });
    } else if (role == "admin") {
      let user = await User.aggregate([
        {
          $addFields: {
            fullName: { $concat: ["$firstName", " ", "$lastName"] },
          },
        },
        {
          $match: {
            $or: [
              { firstName: { $regex: re } },
              { lastName: { $regex: re } },
              { fullName: { $regex: re } },
              { email: { $regex: re } },
              { phoneNumber: { $regex: re } },
              { idNumber: { $regex: re } },
              { college: { $regex: re } },
              { course: { $regex: re } },
            ],
          },
        },
      ]);

      let estab = await Establishment.find({ name: { $regex: re } });

      res.json({
        status: 200,
        data: {
          user,
          estab,
        },
      });
    } else if (role == "landlord") {
      let user = await Tenant.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            pipeline: [
              {
                $addFields: {
                  fullName: { $concat: ["$firstName", " ", "$lastName"] },
                },
              },
              {
                $match: {
                  $or: [
                    { firstName: { $regex: re } },
                    { lastName: { $regex: re } },
                    { fullName: { $regex: re } },
                    { email: { $regex: re } },
                    { phoneNumber: { $regex: re } },
                    { idNumber: { $regex: re } },
                    { college: { $regex: re } },
                    { course: { $regex: re } },
                  ],
                },
              },
            ],
            as: "tenant",
          },
        },
        {
          $unwind: "$tenant",
        },
        {
          $replaceRoot: {
            newRoot: "$tenant",
          },
        },
      ]);
      console.log(user);

      res.json({
        status: 200,
        data: {
          user,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
