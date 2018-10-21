var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    Campground = require("./models/campground");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
// seedDB(); 


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
            res.render("campgrounds/index",{campgrounds:campgrounds});
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
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id",function(req,res){
   
    Campground.findById(req.params.id).populate("comments").exec(function (err,foundcampground){
        if(err){
            console.log(err);
        }else{
            // console.log(foundcampground);
            res.render("campgrounds/show",{campground : foundcampground});
        }
    });
}); 

app.get("/campgrounds/:id/comments/new",function(req,res){
   
    Campground.findById(req.params.id,function (err,foundcampground){
        if(err){
            console.log(err);
        }else{
            // console.log(foundcampground);
            res.render("comments/new",{campground : foundcampground});
        }
    });
});

// app.post("campgrounds/:id/comments",function(req,res){
//     Campground.findById(req.params.id,function (err,campground){
//         if(err){
//             console.log(err);
//             res.redirect("/campgrounds");
//         }else{
//             console.log(req.body.comment);
//             Comment.create(req.body.comment,function(err,comment){
//                 if(err){
//                    console.log(err);
//                 } else{
//                     console.log(comment);
//                     campgrounds.comments.push(comment);
//                     campgrounds.save();
//                     res.redirect("/campgrounds/"+campground._id);
//                 }
//             });
//         }
//     });
// });

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment._id);
                    //create new comment
                    campground.save();
                    //redirect campground to show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
