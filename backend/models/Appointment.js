const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  client: { type: String, required: true },
  date: { type: String, required: true },
  met: { type: Boolean, default: false },
  signed: { type: Boolean, default: false },
  contractValue: { type: Number, default: 0 },
  clearancePending: { type: Boolean, default: false }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
