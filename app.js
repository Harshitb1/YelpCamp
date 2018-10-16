var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String
});

var Campground = mongoose.model("Campground",campgroundSchema);



// var campgrounds = [
//     {name: "Salman Creek",image :"https://photosforclass.com/download/flickr-3753652230"},
//     {name: "Granite Hill",image :"https://photosforclass.com/download/flickr-15215548990"},
//     {name: "Mountain goat", image:"https://photosforclass.com/download/flickr-14360459119"},
//     {name: "Salman Creek",image :"https://photosforclass.com/download/flickr-3753652230"},
//     {name: "Granite Hill",image :"https://photosforclass.com/download/flickr-15215548990"},
//     {name: "Mountain goat", image:"https://photosforclass.com/download/flickr-14360459119"},
//     {name: "Salman Creek",image :"https://photosforclass.com/download/flickr-3753652230"},
//     {name: "Granite Hill",image :"https://photosforclass.com/download/flickr-15215548990"},
//     {name: "Mountain goat", image:"https://photosforclass.com/download/flickr-14360459119"}
// ]

app.listen(5000,function(){
    console.log("YelpCamp has started");
});

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){

    Campground.find({}, function (err,campgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds",{campgrounds:campgrounds});
        }
    });
});

app.post("/campgrounds",function(req,res){
    var name =req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    Campground.create(newCampground,  function(err,campground){
            if(err){
                console.log(err);
            }else{
                console.log("new campground created :");
                console.log(campground);      
                res.redirect("/campgrounds");
            }
         });
   
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});