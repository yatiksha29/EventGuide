var express=require("express");
var cors=require("cors");
var fileuploader=require("express-fileupload");

require('dotenv').config();//reads .env file

var vendorRouter=require("./routers/routerVendor")
var citizenRouter = require("./routers/routerCitizen");
var eventRouter = require("./routers/routerEvent");
var favsRouter = require("./routers/routerFavs");
var ratingRouter = require("./routers/routerRating");
var userRouter = require("./routers/routerUser");

var {doMongooseConnection}=require("./config/mongooseConnect");

let app=express();

app.use(cors( {origin:"https://event-guide-frontend.vercel.app", credentials: true})); 
app.use(express.json()); //To read JSON Array coming from React
app.use(express.urlencoded(true)); //convert POST data to JSON object
app.use(fileuploader());

doMongooseConnection();

//User
app.use("/User", userRouter);

//Vendor Registration APIs
app.use("/Vendor",vendorRouter);

// Citizen Regis. APIs
app.use("/Citizen", citizenRouter);

// Event APIs
app.use("/Event", eventRouter);
app.use("/Favs", favsRouter);
app.use("/Rating", ratingRouter);

app.get("/", (req, res) => {
    res.send("Event Guide Backend is Running Successfully!");
});

app.listen(2003, function(req,resp){
    console.log("Server started on localhost:2003");
})