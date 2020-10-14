
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");



const app=express();
app.set("views",__dirname+"/views");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/authDB",{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});



var secret=process.env.SECRET;

userSchema.plugin(encrypt, {secret:secret,encryptedFields:["password"]});


const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  const userName=req.body.emailAddress;
  const password=req.body.savedPassword;

  User.findOne({email:userName},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
       if(foundUser){
      if(foundUser.password===password){
        res.render("authorisedUser");
      }
    }
  }
  });

});

app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register",function(req,res){
const user=new User({
  email:req.body.emailAddress,
  password:req.body.newPassword
});

user.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("authorisedUser");
  }
});
});

app.listen("3000",function(){
  console.log("This is server 3000");
});
