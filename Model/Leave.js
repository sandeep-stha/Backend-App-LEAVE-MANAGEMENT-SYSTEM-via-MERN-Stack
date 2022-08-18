const mongoose = require("mongoose");

//FOR MONGO REFERENCE TO ANOTHER MODEL
const { ObjectId } = mongoose.Schema.Types;

//LEAVE SCHEMA
const leaveSchema = new mongoose.Schema(
  {
    //Purpose of Leave
    reason: {
      type: String,
      required: [true, "State your purpose of leave"],
    },

    //Leave Start Date
    startDate: {
      type: Date,
      required: [true, "Select the start date of your leave"],
    },

    //Leave End Date
    endDate: {
      type: Date,
    },

    //Type of Leave
    leaveType: {
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
    fullHalf: {
      type: String,
      enum: ["full", "half"],
      required: [true, "Select desired full or half leave"],
    },

    // First half or second half
    selectHalf: {
      type: String,
      enum: ["first", "second"],
    },

    //Status of Leave Applicaion
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
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
