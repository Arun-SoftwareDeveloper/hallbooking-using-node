const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dburl = "mongodb://0.0.0.0:27017/mydatabase"; // Replace 'mydatabase' with your actual database name

mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected!!!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const Customer = require("./models/customer");
const Room = require("./models/room");

app.use(express.json());

app.post("/rooms", async (req, res) => {
  try {
    const { seats, amenities, pricePerHour } = req.body;

    const newRoom = new Room({
      seats,
      amenities,
      pricePerHour,
    });

    const savedRoom = await newRoom.save();

    res.status(201).json(savedRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

app.post("/customers", async (req, res) => {
  try {
    const { CustomerName, Date, start_time, end_time, room_id } = req.body;

    const newCustomer = new Customer({
      CustomerName,
      Date,
      start_time,
      end_time,
      room_id,
    });

    const savedCustomer = await newCustomer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Customer.aggregate([
      {
        $lookup: {
          from: "rooms",
          localField: "room_id",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room",
      },
      {
        $group: {
          _id: {
            customer_id: "$_id",
            room_id: "$room._id",
          },
          customerName: { $first: "$CustomerName" },
          roomName: { $first: "$room.roomName" },
          date: { $first: "$Date" },
          startTime: { $first: "$start_time" },
          endTime: { $first: "$end_time" },
          bookingCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          customerName: 1,
          roomName: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          bookingCount: 1,
        },
      },
    ]);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ error: "Failed to retrieve booking data" });
  }
});

app.listen(4000, () => {
  console.log("The server is running on port 4000!");
});
