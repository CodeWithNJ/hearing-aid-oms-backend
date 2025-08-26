import { Router } from "express";
import {
  allOrders,
  createOrder,
  generateOrderInvoice,
  getOrderDetails,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const orderRouter = Router();

orderRouter.route("/").get(verifyJwt, allOrders);
orderRouter.route("/:id").get(verifyJwt, getOrderDetails);
orderRouter.route("/").post(verifyJwt, createOrder);
orderRouter.route("/:id/status").patch(verifyJwt, updateOrderStatus);
orderRouter.route("/:id/invoice").patch(verifyJwt, generateOrderInvoice);

export default orderRouter;
