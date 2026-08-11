const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection (আপনার লোকাল বা MongoDB Atlas কানেকশন স্ট্রিং দিন)
const MONGO_URI = "mongodb://localhost:27017/bachelor_expense"; 
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Database Schema
const expenseSchema = new mongoose.Schema({
  flatId: { type: String, default: "default_flat" },
  totalMarket: Number,
  totalMeal: Number,
  totalSetup: Number,
  rows: Array
}, { timestamps: true });

const ExpenseModel = mongoose.model("Expense", expenseSchema);

// Socket.io Real-time Connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // ডাটা লোড করার জন্য রিকোয়েস্ট
  socket.on("get_data", async () => {
    let data = await ExpenseModel.findOne({ flatId: "default_flat" });
    socket.emit("load_data", data);
  });

  // ডাটা আপডেট হলে তা সেভ করে বাকি সব ডিভাইসে লাইভ ব্রডকাস্ট করা
  socket.on("update_data", async (updatedData) => {
    let data = await ExpenseModel.findOneAndUpdate(
      { flatId: "default_flat" },
      { 
        totalMarket: updatedData.totalMarket,
        totalMeal: updatedData.totalMeal,
        totalSetup: updatedData.totalSetup,
        rows: updatedData.rows 
      },
      { upsert: true, new: true }
    );

    // সব ডিভাইসে সিঙ্ক করার জন্য পাঠানো
    io.emit("receive_update", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.CURRENT_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});