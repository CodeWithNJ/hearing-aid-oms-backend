import mongoose from "mongoose";
import mongooseAggregate from "mongoose-aggregate-paginate-v2";

const appointmentSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    appointment_type: {
      type: String,
      enum: ["online", "offline"],
    },
    schedule_date: {
      type: Date,
      required: [true, "schedule_date is a mandatory field."],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },

  { timestamps: true }
);

appointmentSchema.plugin(mongooseAggregate);

const Appointments = mongoose.model("Appointment", appointmentSchema);

export default Appointments;
