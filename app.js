var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgrounds = [
    {name: "Salman Creek",image :"https://photosforclass.com/download/flickr-3753652230"},
    {name: "Granite Hill",image :"https://photosforclass.com/download/flickr-15215548990"},
    {name: "Mountain goat", image:"https://photosforclass.com/download/flickr-14360459119"},
    {name: "Salman Creek",image :"https://photosforclass.com/download/flickr-3753652230"},
    {name: "Granite Hill",image :"https://photosforclass.com/download/flickr-15215548990"},
    {name: "Mountain goat", image:"https://photosforclass.com/download/flickr-14360459119"},
    {name: "Salman Creek",image :"https://photosforclass.com/download/flickr-3753652230"},
    {name: "Granite Hill",image :"https://photosforclass.com/download/flickr-15215548990"},
    {name: "Mountain goat", image:"https://photosforclass.com/download/flickr-14360459119"}
]

app.listen(5000,function(){
    console.log("YelpCamp has started");
});

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
 
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res){
    var name =req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground)
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});