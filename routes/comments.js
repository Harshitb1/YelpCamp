var express = require("express");
var router= express.Router({mergeParams:true});
var Comment = require("../models/comment"), 
Campground = require("../models/campground");
 

router.get("/new",isLoggedIn,function(req,res){
   
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

router.post("/",isLoggedIn ,function(req, res){
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
                    comment.author.id =req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
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

router.get("/:comment_id/edit",function(req,res){
     Comment.findById(req.params.comment_id,function(err,comment){
         if(err){
             console.log(err);
             res.redirect("back");
         } else {
            res.render("comments/edit",{campground_id: req.params.id, comment: comment} );
        }
     });
});

router.put("/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:comment_id",function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            cosole.log(err);
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}


module.exports = router;