var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB = require("./seeds"),
    Campground = require("./models/campground");

// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


// Campground.create(
//      {name: "Salman Creek",
//      image :"https://photosforclass.com/download/flickr-3753652230",
//      description: "this is salman creek description"
//     }
//     ,  function(err,campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("new campground created :");
//         console.log(campground);      
//       }
//  });

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
            res.render("index",{campgrounds:campgrounds});
        }
    });
});

app.post("/campgrounds",function(req,res){
    var name =req.body.name;
    var image = req.body.image;
    var image = req.body.image;
    var desc = req.body.description;

    var newCampground = {name:name,image:image, description:desc};
    Campground.create(newCampground,  function(err,campground){
            if(err){
                console.log(err);
            }else{
                // console.log("new campground created :");
                // console.log(campground);      
                res.redirect("/campgrounds");
            }
         });
   
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});

app.get("/campgrounds/:id",function(req,res){
   
    Campground.findById(req.params.id).populate("comments").exec(function (err,foundcampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundcampground);
            res.render("show",{campground : foundcampground});
        }
    });
}); 