import { useEffect ,useState} from "react";
import Button from "../../components/Button";
import MovieForm from "./MovieForm";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { DeleteMovie, GetAllMovies } from "../../apicalls/movies";
import { GetShowsByMovieId } from "../../apicalls/theatres"; // you'll need this

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [showsMap, setShowsMap] = useState({}); // movieId -> shows array
  const [showMovieFormModel, setShowMovieFormModel] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getShowsForMovie = async (movieId) => {
    try {
      const resp = await GetShowsByMovieId(movieId);
      if (resp.success) {
        return resp.data; // array of shows
      } else {
        message.error(`Failed to load shows: ${resp.message}`);
        return [];
      }
    } catch (err) {
      message.error("Error fetching shows: " + err.message);
      return [];
    }
  };

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response.success) {
        const moviesData = response.data;
        setMovies(moviesData);

        // Fetch shows for each movie
        const fetches = moviesData.map((mv) =>
          getShowsForMovie(mv._id).then((shows) => [mv._id, shows])
        );
        const entries = await Promise.all(fetches);

        const newShowsMap = {};
        entries.forEach(([movieId, shows]) => {
          newShowsMap[movieId] = shows;
        });
        setShowsMap(newShowsMap);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleDelete = async (movieId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteMovie({ movieId });
      if (response.success) {
        message.success(response.message);
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

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, record) => (
        <img
          src={record.poster}
          alt="poster"
          height="60"
          width="80"
          className="br-1"
        />
      ),
    },
    { title: "Name", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    { title: "Duration", dataIndex: "duration" },
    { title: "Genre", dataIndex: "genre" },
    { title: "Language", dataIndex: "language" },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, record) =>
        moment(record.releaseDate).format("DD-MM-YYYY"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const shows = showsMap[record._id] || [];
        const hasAnyShow = Array.isArray(shows) && shows.length > 0;

        return (
          <div className="flex gap-1">
            {/* Show delete only if not owner and no show exists */}
            {!user.isOwner && !hasAnyShow && (
              <i
                className="ri-delete-bin-line"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(record._id)}
                title="Delete movie (no shows exist)"
              ></i>
            )}
            <i
              className="ri-pencil-line"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedMovie(record);
                setFormType("edit");
                setShowMovieFormModel(true);
              }}
              title="Edit movie"
            ></i>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-1 responsive-table">
        <Button
          title="Add Movie"
          variant="outlined"
          onClick={() => {
            setShowMovieFormModel(true);
            setFormType("add");
          }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={movies}
        pagination={{ pageSize: 5 }}
        tableLayout="auto"
        className="w-full"
        rowKey={(record) => record._id}
      />
      {showMovieFormModel && (
        <MovieForm
          showMovieFormModel={showMovieFormModel}
          setShowMovieFormModel={setShowMovieFormModel}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}
    </div>
  );
}

export default MoviesList;
