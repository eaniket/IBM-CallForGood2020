var express = require('express')
var app = express()
var alert = require('alert')
var bp = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var methodOverride = require('method-override'),
  request = require("request"),
  cors = require("cors"),
  path = require("path"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  mongoose = require("mongoose"),
  Item = require("./models/items"),
  Buyer = require("./models/buyer")
User = require("./models/user");
var item_route = require("./routes/item_route.js"),
  user_route = require("./routes/user_route.js");
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(methodOverride('_method'));
const uri = "mongodb+srv://sai:sai@cluster0-y4too.mongodb.net/ibmdb?retryWrites=true&w=majority"
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.static('public'));
function diff_hours(t1, t2) {
  var diff = t2 - t1;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
}

var middleware = require("./middleware");

mongoose.connect("mongodb+srv://sai:sai@cluster0-y4too.mongodb.net/ibmdb?retryWrites=true&w=majority", { useNewUrlParser: true })
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo @27017");
});
mongoose.connection.on("error", (err) => {
  if (err)
    console.log("Error Connecting to mongo @27017");
});


// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "I am batman",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.use(new LocalStrategy(Buyer.authenticate()));
// passport.serializeUser(Buyer.serializeUser());
// passport.deserializeUser(Buyer.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


app.use('/item', item_route);
app.use("/", user_route);

app.post('/sellItem', (req, res) => {
  console.log(req.body);
  var obj = {
    sid: req.body.sid,
    type: req.body.type,
    name: req.body.name,
    cat: req.body.cat,
    quantity: parseInt(req.body.quantity),
    unit: req.body.unit,
    threshold: parseInt(req.body.threshold),
    price: parseInt(req.body.price),
    min_size: parseInt(req.body.min_size),
    time_to_live: parseInt(req.body.time_to_live),
    quantity_requested: 0,
    upload_time: Math.floor(Date.now() / 1000),
    status: 'unsold'
  }
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      db.collection("product").insert(obj, function (err, result) {
        if (err) throw err
        console.log("updated")
        res.render("usuccess", { sid: req.body.sid })
      });
    }
    else {
      console.log(err);
    }
  });
});
// app.get('/view', (req, res) => {
//   MongoClient.connect(uri, function (err, client) {
//     if (!err) {
//       var db = client.db('ibmdb');
//       db.collection("product").find({}).toArray((err, result) => {
//         if (!err) {
//           console.log(result);
//           var active = [], time_up = [], sold = [], deleted = [];
//           for (var i = 0; i < result.length; i++) {
//             if (result[i].status === 'deleted') {
//               deleted.push(result[i]);
//             }
//             else if (result[i].status === 'deleted') {
//               sold.push(result[i]);
//             }
//             else if (diff_hours(result[i].upload_time, Math.floor(Date.now() / 1000)) < result[i].time_to_live) {
//               active.push(result[i]);
//             }
//             else {
//               time_up.push(result[i]);
//             }
//           }
//           res.render('view.ejs', { data: { active: active, time_up: time_up, sold: sold, deleted: deleted } });
//         }
//       });
//     }
//     else {
//       console.log(err);
//     }
//   });
// });
// app.post("/delete", (req, res) => {
//   console.log(req.body.id);
//   MongoClient.connect(uri, function (err, client) {
//     if (!err) {
//       var db = client.db('ibmdb');
//       var myquery = { _id: ObjectId(req.body.id) };
//       var newvalues = { $set: { status: "deleted" } };
//       db.collection("product").updateOne(myquery, newvalues, function (err, result) {
//         if (err) throw err;
//         console.log("1 document updated");
//         res.redirect('/view');
//       });
//     }
//     else {
//       console.log(err);
//     }
//   });
// });
// app.post("/update", (req, res) => {
//   console.log(req.body.id);
//   MongoClient.connect(uri, function (err, client) {
//     if (!err) {
//       var db = client.db('ibmdb');
//       var myquery = { _id: ObjectId(req.body.id) };
//       var newvalues = { $set: { status: "done" } };
//       db.collection("product").updateOne(myquery, newvalues, function (err, result) {
//         if (err) throw err;
//         console.log("1 document updated");
//         res.redirect('/view');
//       });
//     }
//     else {
//       console.log(err);
//     }
//   });
// });
app.get('/sellItem/:sid', (req, res) => {
  res.render("sell", { sid: req.params.sid })
});

app.get("/dashb/:sid", function (req, res) {
  res.render("seller", { sid: req.params.sid })
})

app.get("/more/:bid", function (req, res) {
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      var myquery = { type: "nonessen" }
      db.collection("product").find(myquery).toArray(function (err, result) {
        if (err) throw err
        res.render("more", { bid: req.params.bid, essen: result })
      })
    }
    else {
      console.log(err);
    }
  });
})

app.get("/bdashb/:bid", function (req, res) {
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      var myquery = { type: "essen" }
      db.collection("product").find(myquery).toArray(function (err, result) {
        if (err) throw err
        res.render("buyer", { bid: req.params.bid, essen: result })
      })
    }
    else {
      console.log(err);
    }
  });
})

app.get("/borders/:bid", function (req, res) {
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      var myquery = { bid: req.params.bid }
      db.collection("orders").find(myquery).toArray(function (err, result) {
        if (err) throw err
        res.render("borders", { bid: req.params.bid, data: result })
      })
    }
    else {
      console.log(err);
    }
  });
})

//-----------------------NEW CODE ENDS-------------------------//
//CHECKOUT ROUTE FOR ANY ORDER SPECIFIC TO BUYER
app.post("/borders/:bid/checkout", function (req, res) {
  var count = req.body.count;
  var bid = req.params.bid;

  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      for (key in count) {
        if (parseInt(count[key]) >= 1) {

          var myquery = { "_id": key }
          var newvalues = { $set: { quantity_requested: quantity_requested + parseInt(count[key]) } };
          db.collection("products").findOneAndUpdate(myquery, newvalues, function (err, result) {
            if (err) throw err
            name = result.name;
            sid = result.sid;
            status = result.status;

          });
          var obj = { itemname: name, bid: bid, sid: sid, status: status, quantity: parseInt(count[key]) };
          db.collection("orders").insert(obj, function (err, result) {
            if (err) throw err
            console.log("New Order accepted to db!")
          });
          // console.log(obj);
          req.user.orderHistory.push(obj);
          //console.log(req.user);
        }
      }
      Buyer.updateOne(
        { _id: req.user._id },  // <-- find stage
        {
          $set: {                // <-- set stage
            orderHistory: req.user.orderHistory,     // <-- id not _id
          }
        }, function (err) {
        if (err)
          console.log(err);

      }
      )
      res.render("item/confirm", { count: count });
    }
    else {
      console.log(err);
    }
  });
})
//-----------------------NEW CODE ENDS-------------------------//

app.get("/sorders/:sid", function (req, res) {
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      var myquery = { sid: req.params.sid, status: "pending" }
      db.collection("orders").find(myquery).toArray(function (err, result) {
        if (err) throw err
        res.render("sorders", { sid: req.params.sid, data: result })
      })
    }
    else {
      console.log(err);
    }
  });
})

app.post("/confirm/:sid/:bid", function (req, res) {
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      var myquery = { _id: ObjectId(req.body.id) }
      var qry = { _id: ObjectId(req.body.orderid) }
      var newvalues = { $set: { status: "done" } };
      db.collection("product").findOne(qry, function (err, data) {
        var qty = data.quantity -  parseInt(req.body.qty)
        db.collection("orders").updateOne(myquery, newvalues, function (err, result) {
          if (err) throw err
          db.collection("product").updateOne(qry, { $set: { quantity: qty } })
          res.render("usuccess", { sid: req.params.sid })
        })
      })
    }
    else {
      console.log(err);
    }
  });
})

app.get("/inv/:sid", function (req, res) {
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      var myquery = { sid: req.params.sid }
      db.collection("product").find(myquery).toArray(function (err, result) {
        if (err) throw err
        res.render("inven", { sid: req.params.sid, data: result })
      })
    }
    else {
      console.log(err);
    }
  });
})

app.get("/hist/:sid", function (req, res) {
  MongoClient.connect(uri, function (err, client) {
    if (!err) {
      var db = client.db('ibmdb');
      var myquery = { sid: req.params.sid, status: "done" }
      db.collection("orders").find(myquery).toArray(function (err, result) {
        if (err) throw err
        res.render("history", { sid: req.params.sid, data: result })
      })
    }
    else {
      console.log(err);
    }
  });
})

app.listen(3000, (req, res) => {
  console.log("Started seller on 3000")
});
