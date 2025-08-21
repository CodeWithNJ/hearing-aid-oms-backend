import Admins from "../models/admins.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerAdmin = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, username, password } = req.body;

  if ([first_name, username, password].some((field) => !field)) {
    return res
      .status(400)
      .json(new ApiError(400, "Required fields are missing"));
  }

  const existingAdmin = await Admins.findOne({
    username: username.toLowerCase(),
  });

  if (existingAdmin) {
    return res.status(409).json(new ApiError(409, "User already exists."));
  }

  const newAdmin = await Admins.create({
    first_name: first_name.toLowerCase(),
    last_name: last_name ? last_name.toLowerCase() : null,
    username: username,
    password: password,
  });

  const newSavedAdmin = await newAdmin.save();

  const finalResponse = await Admins.findById(newSavedAdmin._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, finalResponse, "New admin registered successfully.")
    );
});

export const loginAdmin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json(new ApiError(400, "Required fields are missing."));

  const validAdmin = await Admins.findOne({ username: username.toLowerCase() });

  if (!validAdmin)
    return res.status(404).json(new ApiError(404, "Admin not found."));

  const isPasswordCorrect = await validAdmin.isPasswordCorrect(password);

  if (!isPasswordCorrect)
    return res.status(401).json(new ApiError(401, "Incorrect Password."));

  const accessToken = await validAdmin.generateAccessToken();
  const refreshToken = await validAdmin.generateRefreshToken();

  const options = {
    httpOnly: true,
    secure: true,
  };

  validAdmin.refreshToken = refreshToken;
  await validAdmin.save();

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken: accessToken },
        "Admin logged in successfully"
      )
    );
});

export const checkAdminAuthenticated = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User is authenticated"));
});
