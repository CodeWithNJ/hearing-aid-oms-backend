import mongoose from "mongoose";
import mongooseAggregate from "mongoose-aggregate-paginate-v2";

const customerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "first_name is a mandatory field."],
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is a mandatory field."],
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "phone is a mandatory field."],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "address is a mandatory field."],
    },
    hearing_loss_level: {
      type: String,
      enum: ["mild", "moderate", "severe"],
      required: [true, "choose atleast one hearing_loss_level."],
    },
    budget_range: {
      type: Number,
      required: [true, "budget_range is a mandatory field."],
    },
  },
  { timestamps: true }
);

customerSchema.plugin(mongooseAggregate);

const Customers = mongoose.model("Customer", customerSchema);

export default Customers;
