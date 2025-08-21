import Customers from "../models/customers.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addCustomer = asyncHandler(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    hearing_loss_level,
    budget_range,
  } = req.body;

  if (
    [first_name, email, phone, address, hearing_loss_level, budget_range].some(
      (field) => !field
    )
  ) {
    return res
      .status(400)
      .json(new ApiError(400, "Required fields are missing"));
  }

  const existingCustomer = await Customers.findOne({
    email: email.toLowerCase(),
  });

  if (existingCustomer) {
    return res.status(409).json(new ApiError(409, "Customer already exists."));
  }

  const newCustomer = await Customers.create({
    first_name: first_name.toLowerCase(),
    last_name: last_name ? last_name.toLowerCase() : null,
    phone,
    email: email.toLowerCase(),
    address: address.toLowerCase(),
    hearing_loss_level,
    budget_range,
  });

  const newSavedcustomer = await newCustomer.save();

  const finalResponse = await Customers.findById(newSavedcustomer._id);

  return res
    .status(201)
    .json(new ApiResponse(201, finalResponse, "Customer added successfully."));
});

export const allCustomers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const pipeline = [
    { $sort: { budget_range: -1 } }, // Sort by budget_range descending.
  ];

  const aggregate = Customers.aggregate(pipeline);

  const options = { page, limit };

  const results = await Customers.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Fetched all customers successfully."));
});

export const customerById = asyncHandler(async (req, res, next) => {
  const customerId = req.params.id;
  const validCustomer = await Customers.findById(customerId);
  if (!validCustomer) {
    return res.status(404).json(new ApiError(404, "Customer not found."));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        validCustomer,
        "Customer details fetched successfully."
      )
    );
});

export const updateCustomer = asyncHandler(async (req, res, next) => {
  const customerId = req.params.id;
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    hearing_loss_level,
    budget_range,
  } = req.body;

  // Check if customer exists
  const validCustomer = await Customers.findById(customerId);
  if (!validCustomer) {
    return res.status(404).json(new ApiError(404, "Customer not found."));
  }

  // Update only fields provided in req.body
  if (first_name !== undefined) validCustomer.first_name = first_name;
  if (last_name !== undefined) validCustomer.last_name = last_name;
  if (email !== undefined) validCustomer.email = email;
  if (phone !== undefined) validCustomer.phone = phone;
  if (address !== undefined) validCustomer.address = address;
  if (hearing_loss_level !== undefined) {
    const validLevels = ["mild", "moderate", "severe"];
    if (!validLevels.includes(hearing_loss_level)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid hearing_loss_level value."));
    }
    validCustomer.hearing_loss_level = hearing_loss_level;
  }
  if (budget_range !== undefined) validCustomer.budget_range = budget_range;

  // Save changes
  const updatedCustomer = await validCustomer.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCustomer,
        "Customer details updated successfully."
      )
    );
});
