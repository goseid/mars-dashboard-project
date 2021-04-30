require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
app.get("/rovers", async (req, res) => {
  if (req.query.rover) {
    const rover = req.query.rover;

    console.log(`/rovers was queried for ${rover}`);
    //res.send({ result: `Server received query received for ${rover}` });
    let resp = await fetch(
      getEndPoint(rover) + process.env.API_KEY
    ).then((res) => res.json());
    console.log("NASA responded with:");
    console.dir(resp);
    res.send(resp);
  } else {
    console.dir(req);
    res.send({ text: "Server received unexpected query at /rovers." });
  }
});

getEndPoint = (rover) => {
  const root = "https://api.nasa.gov/mars-photos/api/v1/rovers/";

  // Request sol 2190 since latest_photos for Spirit returns only 2 photos
  // https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=2190&api_key={{NASA_API_KEY}}
  if (rover === "Spirit") return root + "spirit/photos?sol=2190&api_key=";

  // Request sol 5105 since latest_photos for Opportunity returns only 1 photo
  // https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=5105&api_key={{NASA_API_KEY}}
  if (rover === "Opportunity")
    return root + "opportunity/photos?sol=5105&api_key=";

  // https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key={{NASA_API_KEY}}
  return root + rover.toLowerCase() + "/latest_photos?api_key=";
};

// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
