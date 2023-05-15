import Establishment from "../../../database/models/Establishment";

export default async function handler(req, res) {
  try {
    await Establishment.create({ ...req.body });

    res.status(200).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}
