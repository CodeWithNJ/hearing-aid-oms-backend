import { Router } from "express";
import {
  checkAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerAdmin);
authRouter.route("/login").post(loginAdmin);
authRouter.route("/check-auth").get(verifyJwt, checkAdminAuthenticated);
authRouter.route("/logout").post(verifyJwt, logoutAdmin);

export default authRouter;
