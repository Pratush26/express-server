import express, {
  type Application
} from "express";
import { rootRoute } from "./modules/root/root.route";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { profileRoute } from "./modules/profile/profile.route";
// import { logger } from "./middleware/logger";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import config from "./config";
import cookieParser from "cookie-parser";

const app: Application = express();
const corsOptions = {
  origin: config.origins,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(logger);

app.use("/", rootRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute);

app.use(globalErrorHandler);

export default app