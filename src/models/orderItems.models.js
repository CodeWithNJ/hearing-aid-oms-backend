import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    hearing_aid_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HearingAids",
    },
    quantity: {
      type: Number,
    },
    unit_price: {
      type: Number,
    },
    ear_side: {
      type: String,
      enum: ["left", "right", "both"],
    },
  },
  { timestamps: true }
);

const OrderItems = mongoose.model("OrderItems", orderItemsSchema);

export default OrderItems;
