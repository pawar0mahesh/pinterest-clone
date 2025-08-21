var express = require('express');
var router = express.Router();
const userModel =require("./users");
const postModel =require("./post");
const passport = require('passport');
const upload = require("./multer");


const fs = require("fs");
const path = require("path");
router.post("/delete-post/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id); 

    if (!post) {
      return res.status(404).send("Post not found");
    }

    
    const filePath = path.join(__dirname, "../public/images/uploads", post.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

 
    await postModel.findByIdAndDelete(req.params.id);

 
    await userModel.findByIdAndUpdate(req.user._id, {
      $pull: { posts: req.params.id }
    });

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post");
  }
});


const localStrategy =require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  const errors = req.flash('error'); 
  res.render('login', { error: errors.length > 0 ? errors[0] : null });
}); 


router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user= await userModel.findOne({username:req.session.passport.user})
  const posts = await postModel.find()
  .populate("user")
  res.render("feed", {user,posts,nav: true});
});

router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  const user = await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
   user.posts.push(post._id);
   await user.save();
  res.redirect("/profile")
});

router.post('/change-dp', isLoggedIn, upload.single("profileImage"), async function(req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const user = await userModel.findOne({ username: req.session.passport.user });
  user.dp = req.file.filename; 
  await user.save();

  res.redirect("/profile");
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
 const user= await userModel.findOne({
  username: req.session.passport.user
 })
 .populate("posts")
 console.log(user);
  res.render("profile",{user});
});

router.post("/register", function(req,res){
  const { username, email, fullname}= req.body;
  const userData= new userModel({username, email, fullname});

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile");
    })
  })
})

router.post("/login", passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect: "/login",
  failureFlash:true 
}), function(req,res){
});

router.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
