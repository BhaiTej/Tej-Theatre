const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

// Book show
router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.userId, // ✅ use authenticated user's ID
    });
    await newBooking.save();

    const show = await Show.findById(req.body.show);
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: [...show.bookedSeats, ...req.body.seats],
    });

    res.send({
      success: true,
      message: "Show booked successfully",
      data: newBooking,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Get bookings for logged-in user
router.get("/get-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate("user")
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });

    res.send({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
// Cancel booking
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.send({ success: false, message: "Booking not found" });
    }

    // Remove booked seats from the show
    const show = await Show.findById(booking.show);
    const updatedSeats = show.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat)
    );
    show.bookedSeats = updatedSeats;
    await show.save();

    // Delete booking
    await Booking.findByIdAndDelete(req.params.id);

    res.send({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

module.exports = router;
