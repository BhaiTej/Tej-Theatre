const express = require('express');
const path = require('path'); // ✅ Added this
const app = express();
require('dotenv').config();

const dbConfig = require('./config/dbConfig');

app.use(express.json());

// Routes
const usersRoute = require('./routes/usersRoute');
const moviesRoute = require('./routes/moviesRoute');
const theatresRoute = require('./routes/theatresRoute');
const bookingsRoute = require("./routes/bookingRoute");

app.use('/api/users', usersRoute);
app.use('/api/movies', moviesRoute);
app.use('/api/theatres', theatresRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;

// Render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  // Change "*" to "/*" to avoid path-to-regexp error
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
app.listen(port, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);