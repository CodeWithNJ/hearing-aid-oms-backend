import mongoose from "mongoose";
import mongooseAggregate from "mongoose-aggregate-paginate-v2";

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
      type: String,
      unique: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

ordersSchema.plugin(mongooseAggregate);

const Orders = mongoose.model("Orders", ordersSchema);

export default Orders;
