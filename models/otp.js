const { required } = require("joi");
const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema(
  {
    email_id: {
      type: String,
      required: true,
    },
    emp_id: {
      type: Number,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const OTP = mongoose.model("otp", otpSchema);
module.exports = OTP;
