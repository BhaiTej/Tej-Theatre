import { axiosInstance } from ".";

// Add a new theatre
export const AddTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/add-theatre",
      payload
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// Get all theatres
export const GetAllTheatres = async () => {
  try {
    const response = await axiosInstance.get("/api/theatres/get-all-theatres");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// Update theatre
export const UpdateTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/update-theatre",
      payload
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// Delete theatre
export const DeleteTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/delete-theatre",
      payload
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// Add show
export const AddShow = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/add-show",
      payload
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// Delete show
export const DeleteShow = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/delete-show",
      payload
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const GetAllShowsByTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/get-all-shows-by-theatre",
      payload
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const GetAllTheatresByMovie = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/get-all-theatres-by-movie",
      payload
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
// apicalls/theatres.js
export const GetShowById = async (showId,movie) => {
  try {
    const response = await axiosInstance.post("/api/theatres/get-show-by-id", {
      showId
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
export const GetShowsByMovieId = async (movieId) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/get-shows-by-movie-id",
      { movieId }
    );
    return response.data; // { success, message, data: [...] }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
export const GetShowsByTheatreId = async (theatreId) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatres/get-shows-by-theatre-id",
      { theatreId }
    );
    return response.data; // { success, data: shows[] }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

