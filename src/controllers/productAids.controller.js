import Customers from "../models/customers.models.js";
import HearingAids from "../models/hearingAids.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const allHearingAids = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const pipeline = [
    { $sort: { price: -1 } }, // Sort by price descending.
  ];

  const aggregate = HearingAids.aggregate(pipeline);

  const options = { page, limit };

  const results = await HearingAids.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, results, "Fetched all hearing aids successfully.")
    );
});

export const recommendedHearingAids = asyncHandler(async (req, res, next) => {
  const customerId = req.params.customer_id;

  const customerDetails = await Customers.findById(customerId);

  if (!customerDetails) {
    return res.status(404).json(new ApiError(404, "Customer not found."));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  // Build aggregation pipeline
  const pipeline = [
    {
      $match: {
        suitable_for_loss_levels: customerDetails.hearing_loss_level,
        price: { $lte: customerDetails.budget_range },
      },
    },
    { $sort: { rating: -1 } }, // Sort by rating desc
  ];

  const aggregate = HearingAids.aggregate(pipeline);

  const options = { page, limit };

  const results = await HearingAids.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        results,
        "Fetched recommended hearing aids successfully."
      )
    );
});
