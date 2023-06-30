const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  CustomerName: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  start_time: {
    type: String, 
    default: Date.now, 
  },
  end_time: {
    type: String, 
    default: Date.now, 
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId, 
  },
});

module.exports = mongoose.model("Customer", customerSchema);
