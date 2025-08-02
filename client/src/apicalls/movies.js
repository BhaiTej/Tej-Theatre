import { axiosInstance } from ".";

// Add a new movie
export const AddMovie = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/movies/add-movie", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};

// Get all movies
export const GetAllMovies = async () => {
  try {
    const response = await axiosInstance.get("/api/movies/get-all-movies");
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};

// Update a movie
export const UpdateMovie = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/movies/update-movie", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};
// Delete a movie
export const DeleteMovie = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/movies/delete-movie", payload);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};
export const GetMovieById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/movies/get-movie-by-id/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: error.message };
  }
};
