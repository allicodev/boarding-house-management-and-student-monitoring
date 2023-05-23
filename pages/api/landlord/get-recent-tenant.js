import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    res.json({ status: 200, message: `Successfully fetch` });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
