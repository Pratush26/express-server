import express, {
  type Application
} from "express";
import { rootRoute } from "./modules/root/root.route";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", rootRoute);
app.use("/api/users", userRoute);

export default app