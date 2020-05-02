var bodyParser = require('body-parser');
methodOverride = require('method-override');
expressSanitizer = require('express-sanitizer');
mongoose       = require('mongoose');
express        = require('express');
app            = express();

mongoose.set('useUnifiedTopology',true); //to remove depreciation warnings
mongoose.set('useNewUrlParser',true); // " "
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/restfulBlog'); //connect to Yelpcamp database

// App config
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));

//Mongoose model config
var blogSchema = new mongoose.Schema({
    title        :String,
    image        : String,
    description  : String,
    created      : {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title : "First Blog",
//     image : "https://source.unsplash.com/eDgUyGu93Yw",
//     description: 'This is my first blog'
// });


//Routes
//Index route
app.get('/',(req,res)=>{
    res.redirect('/blogs');
});

app.get('/blogs',(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{blogs: blogs});
        }
    });
});

//New Route
app.get('/blogs/new',(req,res)=>{
    res.render('new');
});

//Create Route
app.post('/blogs',(req,res)=>{
    req.body.blog.description = req.sanitize(req.body.blog.description);
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            res.redirect('/blogs/new');
        }
        else{
            res.redirect('/blogs');
        }
    });
});


//Show Route
app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,blogData)=>{
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.render('show',{blog: blogData});
        }
    });
});


//Edit Route
app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id,(err,blogData)=>{
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.render('edit',{blog: blogData});
        }
    });
});

//Update route
app.put('/blogs/:id',(req,res)=>{
    req.body.blog.description = req.sanitize(req.body.blog.description);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,blog)=>{
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs/'+req.params.id);
        }
    });
    
});

//Delete Route
app.delete('/blogs/:id',(req,res)=>{
   
    Blog.findByIdAndRemove(req.params.id,(err,blog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/blogs');
        }
    });
});


app.listen(3000,()=>{
    console.log('Listening on port 3000');
});