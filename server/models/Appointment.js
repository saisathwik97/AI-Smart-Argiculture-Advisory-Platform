const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expert_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, default: "" },
  status: { type: String, default: "scheduled", enum: ["scheduled", "completed", "cancelled"] }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
