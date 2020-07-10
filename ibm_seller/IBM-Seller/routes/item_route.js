var express     =require("express"),
    router      =express.Router();
const Item = require("../models/items");

var User = require("../models/user");
var middleware = require("../middleware");
const { route } = require("./user_route");
const user = require("../models/user");

//Show All
router.get("/",middleware.isLoggedIn,(req,res,next)=>{
    Item.find(function(err,items){
        
        res.render("item/show",{items:items})
        // res.json(accidents);
    })
    
});
//Show All
router.get("/history",middleware.isLoggedIn,(req,res,next)=>{
    //console.log(req.user)
    var history=req.user.orderHistory;
    res.render("item/history",{history:history});
    //res.send("History")
    
});
//Checkout
router.post("/checkout",middleware.isLoggedIn,(req,res,next)=>{
    
    var count=req.body.count;   
    for (key in count) 
    {
        if (count[key]!=0)
        {
            var obj={itemname:key, status: "Pending",quantity:parseInt(count[key])};
            // console.log(obj);
            req.user.orderHistory.push(obj);
            //console.log(req.user);
        }
    } 
    User.updateOne(
        { _id: req.user._id },  // <-- find stage
        { $set: {                // <-- set stage
               orderHistory: req.user.orderHistory,     // <-- id not _id
               
              } 
        },function(err)
            {
                if(err)
                console.log(err);
                
            }  
          )
    res.render("item/confirm",{count:count});
        
})
//Show Single 
router.get("/show/:id",(req,res,next)=>{
    Item.find({_id:req.params.id},function(err,data){
        if(err)
        console.log(err);
        else
        res.render("item/showone",{item:data})
    })
})

//Create
router.get("/create",(req,res,next)=>{
        res.render("item/create")
  
})

//Add
router.post("/create",(req,res,next)=>{
    // console.log(req.body.category);
    // console.log(req.body.description); 
    // console.log(req.body.quantity);
    // console.log(req.body);
    //console.log(req);
    let newItem=new Item({
        category:   req.body.category,
        quantity:   req.body.quantity,
        price:   req.body.price,
        description: req.body.description,
        imageurl: req.body.imageurl,
        name:req.body.name
    })
    // res.redirect("/");
    
    //     newItem.save((err,item)=>{
    //     if(err)
    //     {
    //         res.send("Failed");
    //     }
    //     else
    //     {
    //         res.redirect("/item");
    //     }
    // });
    Item.create(newItem, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/item");
        }
    });


});

//Update
router.get("/update/:id",function(req,res){
    Item.findById(req.params.id, function(err, foundItem){
        res.render("item/update", {item: foundItem});
    });
})

router.put("/update/:id",function(req,res){
    
    // Item.updateOne(
    //     { _id: req.params.id },  // <-- find stage
    //     { $set: {                // <-- set stage
    //        category: req.body.category,     // <-- id not _id
    //        description: req.body.description,
    //        quantity: req.body.quantity,
    //        description: req.body.description,
    //        imageurl: req.body.imageurl,
    //       price:req.body.price,

    //       } 
    //     } ,function(err)
    //     {
    //         if(err)
    //         console.log(err);
    //         else
    //         res.redirect("/item");
    //     }  
    //   )
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
        if(err){
            res.redirect("/item");
        } else {
            //redirect somewhere(show page)
            res.redirect("/item/show");
        }
     });
});



//Delete
router.delete("/delete/:id",(req,res,next)=>{
   Item.remove({_id:req.params.id},function(err,result){
        if(err)
        {
            res.json(err);
        }
        else
        {
            res.redirect("/item");
        }
    });
});

module.exports=router;