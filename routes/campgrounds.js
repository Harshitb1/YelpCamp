var express = require("express");
var router= express.Router({mergeParams:true});
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
 
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

router.post("/",middleware.isLoggedIn,function(req,res){
    var name =req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
   };

    var newCampground = {name:name,image:image, description:desc, author:author, price:price};

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

router .get("/new",middleware.isLoggedIn,function(req,res){
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

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        
        Campground.findById(req.params.id,function(err,campground){
            if(err){
                res.redirect("/campgrounds")
            } else {
                res.render("campgrounds/edit",{campground:campground});
           
            }
        });
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:id",middleware.checkCampgroundOwnership  ,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.redirect("/login");
//     }
// }

// function checkCampgroundOwnership(req,res,next ){
//     if(req.isAuthenticated()){
        
//         Campground.findById(req.params.id,function(err,campground){
//             if(err){
//                 res.redirect("/campgrounds")
//             } else {
//                 // console.log(campground.author.id);
//                 // console.log(req.user._id);
//                 if(campground.author.id.equals(req.user._id )){

//                     next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         });

//     } else {
//         res.redirect("back  ");
//     }
   
// }

module.exports =router;