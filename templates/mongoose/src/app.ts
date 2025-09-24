import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import env from "@/config/env.js";
import getPublicIP from "@/utils/getPublicIP.js";
import cors from "@/middlewares/security/cors.js";
import helmet from "@/middlewares/security/helmet.js";
import morgan from "@/middlewares/log/morgan.js";
import session from "@/middlewares/security/session.js";
import globalErrorHandler from "@/lib/globalErrorHandler.js";
import NotFoundHandler from "@/lib/notFoundHandler.js";
import RouteManager from "@/routes/RouteManager.js";
import { mongooseConnect } from "@/config/dbs/mongo.js";

const app = express();

/* Proxy */
app.set("trust proxy", true); // for nginx, apache or any proxy

/* Security */
app.use(helmet);
app.use(cors);

/* Parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Session Management */
app.use(session);

/* Log */
app.use(morgan);

/* Set View Engine */
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));
const viewsAssetsPath = path.join(import.meta.dirname, "views", "assets");
app.use("/views", express.static(viewsAssetsPath, { index: false }));

/* Make Public folder static */
const publicPath = path.join(import.meta.dirname, "..", "public");
app.use("/public", express.static(publicPath, { index: false }));

/* Home route render a ejs file */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).render("home");
});

/* Route Manager to manage All routes */
RouteManager(app);

/* Not Found Handler 404 */
app.use(NotFoundHandler);

/* Global Error Handler */
app.use(globalErrorHandler);

/* Server Listen  */
(async () => {
  await mongooseConnect();
  app.listen(env.PORT, async () => {
    console.info(`Server is running....`);
    console.info(`  ➡️  http://localhost:${env.PORT}`);
    console.info(`  ➡️  http://${getPublicIP()}:${env.PORT}\n`);
  });
})();
