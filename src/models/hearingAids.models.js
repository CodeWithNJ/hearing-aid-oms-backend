import mongoose from "mongoose";

const hearingAidsSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      trim: true,
      required: [true, "brand is a mandatory field."],
    },
    type: {
      type: String,
      enum: ["BTE", "ITE", "CIC"],
      required: [true, "choose atleast one type."],
    },
    price: {
      type: Number,
      required: [true, "price is a mandatory field."],
    },
    features: {
      digital_noise_reduction: {
        type: Boolean,
        default: false,
      },
      directional_microphones: {
        type: Boolean,
        default: false,
      },
      wireless_connectivity: {
        type: Boolean,
        default: false,
      },
      rechargable_batteries: {
        type: Boolean,
        default: false,
      },
      telecoils: {
        type: Boolean,
        default: false,
      },
      speech_enhancement_technology: {
        type: Boolean,
        default: false,
      },
      remote_controls: {
        type: Boolean,
        default: false,
      },
    },
    suitable_for_loss_levels: [
      { type: String, enum: ["mild", "moderate", "severe"] },
    ],
    in_stock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const HearingAids = mongoose.model("HearingAids", hearingAidsSchema);

export default HearingAids;
