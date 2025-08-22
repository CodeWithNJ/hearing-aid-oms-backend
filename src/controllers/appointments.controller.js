import mongoose from "mongoose";
import Appointments from "../models/appointments.models.js";
import Orders from "../models/orders.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllAppointments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const pipeline = [
    { $sort: { schedule_date: -1 } }, // Sort by schedule_date descending.
  ];

  const aggregate = Appointments.aggregate(pipeline);

  const options = { page, limit };

  const results = await Appointments.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, results, "Fetched all appointments successfully.")
    );
});

export const createAppointment = asyncHandler(async (req, res, next) => {
  const { customer_id, order_id, appointment_type, schedule_date, notes } =
    req.body;

  const validOrderAndCustomer = await Orders.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(order_id),
        customer_id: new mongoose.Types.ObjectId(customer_id),
      },
    },
  ]);

  if (!validOrderAndCustomer || validOrderAndCustomer.length === 0) {
    return res
      .status(404)
      .json(new ApiError(404, "Customer not found or order not found."));
  }

  // schedule_date should be greater than or equal to delivery_date for the order, if not send error response.
  const order = validOrderAndCustomer[0];
  const deliveryDate = new Date(order.delivery_date);
  const appointmentDate = new Date(schedule_date);

  if (appointmentDate < deliveryDate) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          `Appointment cannot be scheduled before the order delivery date (${deliveryDate.toDateString()}).`
        )
      );
  }

  if (!["online", "offline"].includes(appointment_type)) {
    return res.status(400).json(new ApiError(400, "Invalid appointment_type"));
  }

  const newAppointment = await Appointments.create({
    customer_id,
    order_id,
    appointment_type,
    schedule_date: new Date(schedule_date),
    notes,
  });

  const savedNewAppointment = await newAppointment.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        savedNewAppointment,
        "New appointment created successfully"
      )
    );
});

export const updateAppointment = asyncHandler(async (req, res, next) => {
  const appointmentId = req.params.id;

  const { appointment_type, schedule_date, notes, status } = req.body;

  const validAppointment = await Appointments.findById(appointmentId);

  if (!validAppointment) {
    return res.status(404).json(new ApiError(404, "Appointment not found"));
  }

  // Update only fields provided in req.body
  if (appointment_type !== undefined) {
    const validAppointmentTypes = ["online", "offline"];
    if (!validAppointmentTypes.includes(appointment_type)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid appointment type."));
    }
    validAppointment.appointment_type = appointment_type;
  }

  if (schedule_date !== undefined) {
    const validOrderAndCustomer = await Orders.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(validAppointment.order_id),
          customer_id: new mongoose.Types.ObjectId(
            validAppointment.customer_id
          ),
        },
      },
    ]);
    const deliveryDate = new Date(validOrderAndCustomer[0].delivery_date);
    const appointmentDate = new Date(schedule_date);

    if (appointmentDate < deliveryDate) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            `Appointment cannot be scheduled before the order delivery date (${deliveryDate.toDateString()}).`
          )
        );
    }

    validAppointment.schedule_date = appointmentDate;
  }

  if (notes !== undefined) validAppointment.notes = notes;
  if (status !== undefined) {
    const validStatus = ["pending", "completed", "cancelled"];
    if (!validStatus.includes(status)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid appointment status"));
    }
    validAppointment.status = status;
  }

  // Save changes
  const updatedAppointment = await validAppointment.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAppointment,
        "Appointment details updated successfully."
      )
    );
});
