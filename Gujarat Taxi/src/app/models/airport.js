import mongoose from "mongoose";

const airportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      default: null,
    },
  },
  { timestamps: true }
);

airportSchema.index({ url: 1 }, { unique: true });

const AIRPORT = mongoose.models.Airport || mongoose.model("Airport", airportSchema);

export default AIRPORT;

