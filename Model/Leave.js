const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const leaveSchema = new mongoose.Schema(
  {
    //Purpose of Leave
    reason: {
      type: String,
      required: [true, "State your purpose of leave"],
    },

    //Leave Start Date
    start_date: {
      type: Date,
      required: [true, "Select the start date of your leave"],
    },

    //Leave End Date
    end_date: {
      type: Date,
    },

    //Type of Leave
    leave_type: {
      type: String,
      enum: {
        values: [
          "annual",
          "sick",
          "emergency",
          "bereavement",
          "personal",
          "casual",
        ],
        message: "Select the type of your leave",
      },
      required: [true, "Select Your Leave Type"],
    },

    //Leave Variation By Full or Half
    half_full: {
      type: String,
      enum: ["first_half", "second_half", "full"],
      required: [true, "Select desired half or full leave"],
    },

    //First half or second half
    // fhalf_lhalf: {
    //   type: String,
    //   enum: ["first_half", "second_half"],
    // },

    //Status of Leave Applicaion
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
    },

    //Remarks of Leave
    remarks: {
      type: String,
    },

    //To upload a file
    files: {
      type: String,
    },

    //Reference to User Model
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } //Timestamps for records
);

module.exports = mongoose.model("Leave", leaveSchema);
