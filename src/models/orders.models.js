import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    status: {
      type: String,
      enum: ["ordered", "shipped", "delivered", "fitted"],
      default: "ordered",
    },
    total_amount: {
      type: Number,
    },
    insurance_discount: {
      type: Number,
    },
    delivery_date: {
      type: Date,
    },
    tracking_number: {
      type: Number,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.Model("Orders", ordersSchema);

export default Orders;
