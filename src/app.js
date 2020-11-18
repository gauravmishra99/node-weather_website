const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

//Setup static directory to store
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Gaurav Mishra",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Gaurav Mishra",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    name: "Gaurav Mishra",
  });
});

// app.get('', (req,res)=>{
//     res.send('<h1>Weather</h1>')
// })

// app.get("/help", (req, res) => {
//   res.send([
//     {
//       name: "Gaurav",
//       age: 27,
//     },
//     {
//       name: "Sarah",
//       age: 26,
//     },
//   ]);
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>About</h1>");
// });

app.get("/weather", (req, res) => {
  if (!req.query.address){
    return res.send({
      error: "You must provide an address"
    })
  }

  geocode(req.query.address, (error, {latitude, longitude, location}= {})=>{
    if (error){
      return res.send({
        error
      })
    }

    forecast(longitude, latitude, (error, forecastData)=>{
      if (error){
        return res.send({
          error
        })
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Help article not found",
    name: "Gaurav Mishra",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found",
    name: "Gaurav Mishra",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
