import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  allHearingAids,
  recommendedHearingAids,
} from "../controllers/productAids.controller.js";

const hearingAidRouter = Router();

hearingAidRouter.route("/").get(verifyJwt, allHearingAids);
hearingAidRouter
  .route("/recommend/:customer_id")
  .get(verifyJwt, recommendedHearingAids);

export default hearingAidRouter;
