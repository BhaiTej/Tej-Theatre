import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { GetMovieById } from "../../apicalls/movies";
import { GetAllTheatresByMovie } from "../../apicalls/theatres";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

function TheatresForMovie() {
  const tempDate = new URLSearchParams(window.location.search).get("date");
  const [date, setDate] = useState(
    tempDate || moment().format("YYYY-MM-DD")
  );
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetMovieById(params.id);
      console.log("Movie response:", response);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message || "Failed to load movie");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  const getTheatres = async () => {
    try {
      dispatch(ShowLoading());
      console.log("Fetching theatres for", { movie: params.id, date });
      const response = await GetAllTheatresByMovie({ movie: params.id, date });
      console.log("Theatres response:", response);
      if (response.success) {
        setTheatres(response.data);
      } else {
        message.error(response.message || "Failed to load theatres");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, [params.id]);

  useEffect(() => {
    getTheatres();
    navigate(`/movie/${params.id}?date=${date}`, { replace: true });
  }, [date]);

  if (!movie) {
    return <div>Loading movie details...</div>;
  }

  return (
    <div>
      {/* movie information */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl uppercase">
            {movie.title} ({movie.language})
          </h1>
          <h1 className="text-md">
            Duration : {movie.duration ?? "N/A"} mins
          </h1>
          <h1 className="text-md">
            Release Date :{" "}
            {movie.releaseDate
              ? moment(movie.releaseDate).format("MMM Do YYYY")
              : "N/A"}
          </h1>
          <h1 className="text-md">Genre : {movie.genre || "N/A"}</h1>
        </div>

        <div>
          <h1 className="text-md">Select Date</h1>
          <input
            type="date"
            min={moment().format("YYYY-MM-DD")}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
      </div>

      <hr />

      {/* movie theatres */}
      <div className="mt-1">
        <h1 className="text-xl uppercase">Theatres</h1>
      </div>

      {theatres.length === 0 && (
        <div className="mt-4">
          No theatres showing this movie on {moment(date).format("MMM Do, YYYY")}.
        </div>
      )}

      <div className="mt-1 flex flex-col gap-4">
        {theatres.map((theatre) => (
          <div className="card p-2" key={theatre._id}>
            <h1 className="text-md uppercase">{theatre.name}</h1>
            <h1 className="text-sm">Address : {theatre.address}</h1>

            {theatre.owner && (
              <div className="text-sm mt-1">
                <p>
                  <strong>Owner:</strong> {theatre.owner.name}
                </p>
                <p>
                  <strong>Email:</strong> {theatre.owner.email}
                </p>
              </div>
            )}

            <div className="divider"></div>

            <div className="flex gap-2 flex-wrap">
              {(theatre.shows || [])
                .slice()
                .sort((a, b) => {
                  const ta = moment(a.time, "HH:mm");
                  const tb = moment(b.time, "HH:mm");
                  return ta.diff(tb);
                })
                .map((show) => (
                  <div
                    className="card p-1 cursor-pointer"
                    key={show._id}
                    onClick={() => {
                      navigate(`/book-show/${show._id}`);
                    }}
                  >
                    <h1 className="text-sm">
                      {moment(show.time, "HH:mm").format("hh:mm A")}
                    </h1>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TheatresForMovie;
