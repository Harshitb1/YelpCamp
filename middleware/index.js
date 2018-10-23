var Comment = require("../models/comment"), 
    Campground = require("../models/campground");

var middlewareObj ={};

 middlewareObj.checkCampgroundOwnership = function(req,res,next ){
        if(req.isAuthenticated()){
            
            Campground.findById(req.params.id,function(err,campground){
                if(err){
                    flash("error","Campground not found");
                    res.redirect("/campgrounds")
                } else {
                    // console.log(campground.author.id);
                    // console.log(req.user._id);
                    if(campground.author.id.equals(req.user._id )){
    
                        next();
                    }else{
                        req.flash("error","You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
    
        } else {
            req.flash("error","you need to be logged in to do that");
            res.redirect("back");
        }
       
    }

    middlewareObj.checkCommentOwnership =function (req,res,next){
        if(req.isAuthenticated()){
            
            Comment.findById(req.params.comment_id,function(err,comment){
                if(err){
                    flash("error","Comment not found");
                    res.redirect("/campgrounds")
                } else {
                    // console.log(campground.author.id);
                    // console.log(req.user._id);
                    if(comment.author.id.equals(req.user._id )){
    
                        next();
                    }else{
                        req.flash("error","You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
    
        } else {
            req.flash("error","you need to be logged in to do that");
            res.redirect("back");
        }
    }

    middlewareObj.isLoggedIn =function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash("error","please login first!");
            res.redirect("/login");
        }
    }
 
module.exports = middlewareObj