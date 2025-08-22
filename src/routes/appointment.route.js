import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createAppointment,
  getAllAppointments,
  updateAppointment,
} from "../controllers/appointments.controller.js";

const appointmentsRouter = Router();

appointmentsRouter.route("/").get(verifyJwt, getAllAppointments);
appointmentsRouter.route("/").post(verifyJwt, createAppointment);
appointmentsRouter.route("/:id").patch(verifyJwt, updateAppointment);

export default appointmentsRouter;
