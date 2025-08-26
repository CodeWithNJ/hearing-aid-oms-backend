import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addCustomer,
  allCustomers,
  customerById,
  updateCustomer,
} from "../controllers/customers.controller.js";

const customerRouter = Router();

customerRouter.route("/").post(verifyJwt, addCustomer);
customerRouter.route("/").get(verifyJwt, allCustomers);
customerRouter.route("/:id").get(verifyJwt, customerById);
customerRouter.route("/:id").patch(verifyJwt, updateCustomer);

export default customerRouter;
