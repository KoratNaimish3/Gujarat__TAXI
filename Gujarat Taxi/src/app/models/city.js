import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
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

citySchema.index({ url: 1 }, { unique: true });

const CITY = mongoose.models.City || mongoose.model("City", citySchema);

export default CITY;

