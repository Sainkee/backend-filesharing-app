import File from "../models/userfile.model.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const handleFilePostRoute = async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    console.log("Uploading file to Cloudinary:", file.path);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: uuidv4(),
      folder: "uploads",
    });

    console.log(result);

    // Create a new file record in the database
    const newFile = new File({
      filename: file.originalname,
      path: result.secure_url, // URL from Cloudinary
      size: file.size,
      uuid: uuidv4(), // Generate a new UUID
    });

    await File.create(newFile);
    fs.unlinkSync(file.path);

    // Construct download link
    const downloadLink = `${req.protocol}://${req.get("host")}/files/${
      newFile.uuid
    }`;

    res.status(201).json({ downloadLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleGetLink = async (req, res, next) => {
  const id = req.params.uuid;

  try {
    const file = await File.findOne({ uuid: id }).select("path");

    if (!file) {
      throw new Error("File not found");
    }

    res.status(200).json({ downloadLink: file.path });
  } catch (error) {
    next(error);
  }
};
