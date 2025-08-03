import { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetShowById } from "../../apicalls/theatres";
import { BookShowTickets } from "../../apicalls/bookings"; // ✅ Corrected
import { Button, message } from "antd";
import moment from "moment";

function BookShow() {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = useState(null);
  const params = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetShowById({ showId: params.id });
      if (response.success) {
        setShow(response.data);
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
    // eslint-disable-next-line
  }, []);

  const getSeats = () => {
    if (!show) return null;
    const columns = 12;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div className="flex gap-1 flex-col p-2 card">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 justify-center">
            {Array.from({ length: columns }).map((_, colIdx) => {
              const seatNumber = rowIdx * columns + colIdx + 1;
              if (seatNumber > totalSeats) return null;

              let seatClass = "seat";
              if (selectedSeats.includes(seatNumber))
                seatClass += " selected-seat";
              if (show.bookedSeats.includes(seatNumber))
                seatClass += " booked-seat";

              const disabled = show.bookedSeats.includes(seatNumber);

              return (
                <div
                  key={colIdx}
                  className={seatClass}
                  style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                  onClick={() => {
                    if (disabled) return;
                    if (selectedSeats.includes(seatNumber)) {
                      setSelectedSeats((prev) =>
                        prev.filter((s) => s !== seatNumber)
                      );
                    } else {
                      setSelectedSeats((prev) => [...prev, seatNumber]);
                    }
                  }}
                >
                  <h1 className="text-sm">{seatNumber}</h1>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const handleBooking = async () => {
    if (!user || !user._id) {
      message.error("User not authenticated");
      return;
    }

    if (selectedSeats.length === 0) {
      message.warning("Please select at least one seat");
      return;
    }

    const conflict = selectedSeats.some((s) => show.bookedSeats.includes(s));
    if (conflict) {
      message.error("Some selected seats are already booked. Please refresh.");
      return;
    }

    try {
      dispatch(ShowLoading());
      const payload = {
        show: show._id,
        seats: selectedSeats,
        user: user._id, // backend should validate this via token too
        bookingDate: new Date(),
        amount: selectedSeats.length * show.ticketPrice,
      };

      const response = await BookShowTickets(payload); // ✅ Fixed usage

      if (response.success) {
        message.success("Booking successful");
        setSelectedSeats([]);
        await getData();
      } else {
        message.error(response.message || "Booking failed");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
    }
  };
  // const allSeatsBooked = show && show.bookedSeats.length >= show.totalSeats;

  return (
    show && (
      <div>
        <div className="flex justify-between card p-2 items-center">
          <div>
            <h1 className="text-xl">{show.theatre.name}</h1>
            <h1 className="text-sm">{show.theatre.address}</h1>
          </div>
          <div>
            <h2 className="text-2xl uppercase">
              {show.movie.title} ({show.movie.language})
            </h2>
          </div>
          <div className="text-xl">
            {moment(show.date).format("MMM Do yyyy")} -{" "}
            {moment(show.time, "HH:mm").format("hh:mm A")}
          </div>
        </div>

        <div className="seats-wrapper">
          {show?.bookedSeats?.length >= show?.totalSeats ? (
            <div className="no-seats-message">
              All seats are booked for this show.
            </div>
          ) : (
            <div className="seats-container">{getSeats()}</div>
          )}
        </div>

        {selectedSeats.length > 0 && (
          <div className="mt-2 flex flex-col items-center gap-2">
            <div className="text-center text-sm sm:text-base font-medium">
              <span className="font-medium">
                Seats: {selectedSeats.join(", ")}
              </span>{" "}
              | <span>Qty: {selectedSeats.length}</span> |{" "}
              <span>Total: ₹{selectedSeats.length * show.ticketPrice}</span>
            </div>
            <div>
              <Button type="primary" size="large" onClick={handleBooking}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default BookShow;
