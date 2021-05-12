///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables - only use 1x so don't need variable 
require("dotenv").config();
//destructure process.env objcet > pull out PORT (instead of process.env.port)
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object - keeps track of all of our routes 
const app = express();
//import mongoose to connect to DB
const mongoose = require("mongoose")
// import middlware
//prevents cors errors - looking for certain headers when requests are made, if dont have the headers then get cors errors and wont let you get api info 
const cors = require("cors");
//logger - logs messages so we can see whats going on 
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection - connect to this URL and then pass this obj to get rid of deprecation errors/warnings
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

//mongoose allows us to create models - mechanism to interact with DB
mongoose.connection
  .on("open", () => console.log("Your are connected to Mongo"))
  .on("close", () => console.log("Your are disconnected from Mongo"))
  .on("error", (error) => console.log(error));


///////////////////////////////
// MODELS 
////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
  });

//model
const People = mongoose.model("People", PeopleSchema);

///////////////////////////////
// MiddleWare 
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging when requets are made 
app.use(express.json()); // parse json bodies


///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route 
app.get("/", (req, res) => {
  res.send("hello world");
});

// PEOPLE INDEX ROUTE 
app.get("/people", async (req, res) => {
    try {
      // send all people from DB
      res.json(await People.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

// PEOPLE CREATE ROUTE 
app.post("/people", async (req, res) => {
    try {
      res.json(await People.create(req.body));
    } catch (error) {
      //send error back as json if is one 
      res.status(400).json(error);
    }
  });

// PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req, res) => {
    try {
      // send back res.json
      res.json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

// PEOPLE DELETE ROUTE
app.delete("/people/:id", async (req, res) => {
    try {
      res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));