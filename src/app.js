const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Levani",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About page",
    name: "Levani",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help page",
    help_message: "this is help messagge",
    name: "Levani",
  });
});

app.get("/weather", (req, res) => {
  const { location } = req.query;

  if (!location)
    return res.send({
      message: "you fucking donkey! send me location",
      urlformat: "baseurl/weather?location=location-name",
    });

  geocode(location, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.location,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Levani",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Levani",
    errorMessage: "Page not found",
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
