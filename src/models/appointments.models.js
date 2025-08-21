import mongoose from "mongoose";

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
    },
    notes: {
      type: String,
      trim: true,
    },
  },

  { timestamps: true }
);

const Appointments = mongoose.Model("Appointment", appointmentSchema);

export default Appointments;
