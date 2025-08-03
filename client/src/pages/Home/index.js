import { useEffect, useState } from "react";
import { Col, message, Row } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apicalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Home() {
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
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
    <div className="home-container">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search for movies..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Row gutter={[20]} className="mt-2">
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((movie) => (
            <Col xs={24} sm={12} md={8} lg={6} key={movie._id}>
              <div
                className="movie-card"
                onClick={() =>
                  navigate(
                    `/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`
                  )
                }
              >
                <div className="movie-poster-wrapper">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="movie-poster"
                  />
                </div>
                <div className="movie-info">
                  <h1>{movie.title}</h1>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
}

export default Home;
