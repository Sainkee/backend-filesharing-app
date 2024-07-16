import express from "express";
import upload from "../middlewere/multer.js";
import {
  handleFilePostRoute,
  handleGetLink,
} from "../controllers/file.controller.js";

const route = express.Router();

route.post("/api/file/post", upload.single("file"), handleFilePostRoute);

// id basis

route.get("/files/:uuid", handleGetLink);

export default route;
