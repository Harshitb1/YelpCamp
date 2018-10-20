var mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    Campground = require("./models/campground");
var data = [
    {name : "clouds rest" , description: "bloah blah blah",image :"https://www.nps.gov/maca/planyourvisit/images/MapleSpringsCampground-Campsite.jpg?maxwidth=1200&maxheight=1200&autorotate=false"}
   , {name : "sky high" , description: "its sky descriptoion",image :"https://www.nps.gov/maca/planyourvisit/images/MapleSpringsCampground-Campsite.jpg?maxwidth=1200&maxheight=1200&autorotate=false"}
   , {name : "ccolt steels" , description: "colt steele", image :"https://www.nps.gov/maca/planyourvisit/images/MapleSpringsCampground-Campsite.jpg?maxwidth=1200&maxheight=1200&autorotate=false"}

]

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a campground");
                    Comment.create(
                        {text : "this place is great",author:"Homer"},
                        function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment");
                            }
              
                        });
                    
                }
            });
        });
    }); 

}

module.exports = seedDB;