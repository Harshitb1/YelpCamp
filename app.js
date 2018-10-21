var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    passport= require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Campground = require("./models/campground");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
// seedDB(); 
app.use(require("express-session")({
    secret:"Once again rusty wins",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
   res.locals.currentUser =req.user;
   next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
            res.render("campgrounds/index",{campgrounds:campgrounds,currentUser: req.user});
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
   
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

app.post("/campgrounds/:id/comments",isLoggedIn ,function(req, res){
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

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
{ successRedirect:"/campgrounds",
  failureRedirect:"/login"
}),function(req,res){
    
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}
