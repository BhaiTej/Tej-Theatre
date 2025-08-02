import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message } from "antd";
import { GetBookingsOfUser, CancelBooking } from "../../apicalls/bookings";
import moment from "moment";


function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingsOfUser();

      if (response.success) {
        const cleaned = Array.isArray(response.data)
          ? response.data.filter(
              (b) =>
                b &&
                b._id &&
                b.show &&
                b.show.movie &&
                b.show.theatre &&
                Array.isArray(b.seats)
            )
          : [];
        setBookings(cleaned);
      } else {
        message.error(response.message);
      }

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      dispatch(ShowLoading());
      const response = await CancelBooking(bookingId);
      if (response.success) {
        message.success("Booking cancelled successfully");
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bookings-container">
      {bookings.map((booking) => (
        <div className="booking-card" key={booking._id}>
          <div className="booking-info">
            <h2>
              {booking.show.movie.title}{" "}
              <span>({booking.show.movie.language})</span>
            </h2>
            <p className="theatre">
              {booking.show.theatre.name} - {booking.show.theatre.address}
            </p>
            <p>
              <strong>Date & Time:</strong>{" "}
              {moment(booking.show.date).format("MMM Do YYYY")} -{" "}
              {moment(booking.show.time, "HH:mm").format("hh:mm A")}
            </p>
            <p>
              <strong>Amount:</strong> ₹
              {booking.show.ticketPrice * booking.seats.length}
            </p>
            <p>
              <strong>Booking ID:</strong> {booking._id}
            </p>
            <p>
              <strong>Seats:</strong> {booking.seats.join(", ")}
            </p>
            <Button
              danger
              type="primary"
              onClick={() => handleCancel(booking._id)}
              title="Cancel Booking"
            >
              Cancel Booking
            </Button>
          </div>
          <div className="booking-poster">
            <img
              src={booking.show.movie.poster}
              alt="Poster"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Bookings;
