import dbConnect from "../../database/dbConnect";

const JWT_PRIVATE_KEY = "okay";

export default async function handler(req, res) {
  await dbConnect();

  res.json({
    message: "Connection status success",
  });
}
