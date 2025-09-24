import { Express } from "express";
import userRoute from "@/routes/userRoute.js";

const RouteManager = (app: Express) => {
  app.use("/", userRoute);
};

export default RouteManager;
