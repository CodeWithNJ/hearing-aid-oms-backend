import mongoose from "mongoose";
import Customers from "../models/customers.models.js";
import OrderItems from "../models/orderItems.models.js";
import Orders from "../models/orders.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const allOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const pipeline = [
    { $sort: { createdAt: -1 } }, // Sort by budget_range descending.
  ];

  const aggregate = Orders.aggregate(pipeline);

  const options = { page, limit };

  const results = await Orders.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Fetched all orders successfully."));
});

export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    customer_id,
    insurance_discount = 0,
    notes,
    items, // array of order items
  } = req.body;

  // check whether customer exists or not.
  const validCustomer = await Customers.findById(customer_id);

  if (!validCustomer) {
    return res.status(404).json(new ApiError(404, "Customer not found"));
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Order should include atleast one item"));
  }

  // calculate total from items
  let totalAmount = 0;
  items.forEach((item) => {
    totalAmount += item.unit_price * item.quantity;
  });

  // apply insurance discount if any
  totalAmount -= insurance_discount;

  const today = new Date();

  const deliveryDate = new Date(today);

  deliveryDate.setDate(today.getDate() + 1);

  // create order
  const order = await Orders.create({
    customer_id,
    status: "ordered",
    total_amount: totalAmount,
    insurance_discount,
    delivery_date: deliveryDate,
    tracking_number: crypto.randomUUID(),
    notes,
  });

  // create order items with reference to order._id
  const orderItemsData = items.map((item) => ({
    order_id: order._id,
    hearing_aid_id: item.hearing_aid_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    ear_side: item.ear_side,
  }));

  const orderItems = await OrderItems.insertMany(orderItemsData);

  res
    .status(201)
    .json(
      new ApiResponse(201, { order, orderItems }, "Order created successfully.")
    );
});

export const getOrderDetails = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;

  const validOrder = await Orders.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order_id",
        as: "items",
      },
    },
  ]);

  if (!validOrder || validOrder.length === 0) {
    return res.status(404).json(new ApiError(404, "Order details not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, validOrder, "Order details fetched successfully")
    );
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;

  const { status } = req.body;

  const validOrder = await Orders.findById(orderId);

  if (!validOrder) {
    return res.status(404).json(new ApiError(404, "Order not found"));
  }

  if (!["ordered", "shipped", "delivered", "fitted"].includes(status)) {
    return res.status(400).json(new ApiError(400, "Invalid order status"));
  }

  const updatedOrder = await Orders.findByIdAndUpdate(
    validOrder._id,
    { $set: { status } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedOrder, "Order status updated successfully.")
    );
});

export const generateOrderInvoice = asyncHandler(async (req, res, next) => {});
