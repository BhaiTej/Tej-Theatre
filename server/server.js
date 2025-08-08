const express = require("express");
const app = express();
require("dotenv").config();

require("./config/dbConfig"); // MongoDB connect file

app.use(express.json());

const usersRoute = require("./routes/usersRoute");
const moviesRoute = require("./routes/moviesRoute");
const theatresRoute = require("./routes/theatresRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/theatres", theatresRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;
const path = require("path");

// Render frontend for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
  });
}
console.log("Registering /api/users");
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
