import express, {
  type Application
} from "express";
import { rootRouter } from "./modules/root/root.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", rootRouter)
export default app