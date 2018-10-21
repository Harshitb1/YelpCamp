var express = require("express");
var router= express.Router({mergeParams:true});
var Campground = require("../models/campground");
 
router.get("/",function(req,res){

    Campground.find({}, function (err,campgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:campgrounds,currentUser: req.user});
        }
    });
});

router.post("/",function(req,res){
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

router .get("/new",function(req,res){
    res.render("campgrounds/new.ejs");
});

router.get("/:id",function(req,res){
   
    Campground.findById(req.params.id).populate("comments").exec(function (err,foundcampground){
        if(err){
            console.log(err);
        }else{
            // console.log(foundcampground);
            res.render("campgrounds/show",{campground : foundcampground});
        }
    });
}); 

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}


module.exports =router;