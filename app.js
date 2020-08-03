var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    mongoDB          = "mongodb://127.0.0.1/blog-app",
    db               = mongoose.connection;
    
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
db.on('error',console.error.bind(console,'MongoDB connection error:'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static("public/images"));
app.use(express.static("public"));
app.set("view engine","ejs");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({}, function(err,blogs){
        if(err)
            console.log(error);
        else
        res.render("index", {blogs: blogs});
    })

})

//HOME
app.get("/",function(req,res){
    res.redirect("/blogs");
})

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
            res.render("new");
        else
            res.redirect("/blogs");
    })
})

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.redirect("/blogs");
        else
            res.render("show", {blog: foundBlog});
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.redirect("/blogs");
        else
            res.render("edit", {blog: foundBlog});
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/" + req.params.id);
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err)
            res.redirect("/blogs/:id");
        else
            res.redirect("/blogs");
    })
})

//Default
app.get("*",function(req,res){
    res.send("Sorry, Page not found.....");
});

// PORT Listener
app.listen(3000, function(){
    console.log("Server is Running !!!");
})

// default: "https://images.unsplash.com/photo-1588793304011-99af673b3231?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"