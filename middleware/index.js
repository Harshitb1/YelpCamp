var Comment = require("../models/comment"), 
    Campground = require("../models/campground");

var middlewareObj ={};

 middlewareObj.checkCampgroundOwnership = function(req,res,next ){
        if(req.isAuthenticated()){
            
            Campground.findById(req.params.id,function(err,campground){
                if(err){
                    res.redirect("/campgrounds")
                } else {
                    // console.log(campground.author.id);
                    // console.log(req.user._id);
                    if(campground.author.id.equals(req.user._id )){
    
                        next();
                    }else{
                        res.redirect("back");
                    }
                }
            });
    
        } else {
            res.redirect("back");
        }
       
    }

    middlewareObj.checkCommentOwnership =function (req,res,next){
        if(req.isAuthenticated()){
            
            Comment.findById(req.params.comment_id,function(err,comment){
                if(err){
                    res.redirect("/campgrounds")
                } else {
                    // console.log(campground.author.id);
                    // console.log(req.user._id);
                    if(comment.author.id.equals(req.user._id )){
    
                        next();
                    }else{
                        res.redirect("back");
                    }
                }
            });
    
        } else {
            res.redirect("back");
        }
    }

    middlewareObj.isLoggedIn =function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect("/login");
        }
    }
 
module.exports = middlewareObj