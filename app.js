const express=require('express');
const morgan=require('morgan');
const monogoose =require('mongoose');
const Blog = require('./models/blog');

const app=express();

// connect to the data base 
const dbURL='mongodb+srv://myname:123@cluster0.yfv0obr.mongodb.net/ClusterO?retryWrites=true&w=majority'
monogoose.connect(dbURL,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>  app.listen(3000) )
.catch((err)=> console.log(err));
// .then((result) => console.log("connecto to db"))
// .catch((err)=> console.log(err));

app.set('view engine','ejs');


//  middleware
app.use(express.static('public'));

// middle ware and static files

app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>
{
    res.redirect('./blogs');
})


// home route
app.get('/blogs',(req,res)=>
{
  
  Blog.find().sort({createdAt:-1})
  .then((result) =>
    {
       res.render('index',{name:'All blogs',blogs:result})
    })
    .catch(err=>
    {
      console.log(err);
    })
})
app.post('/blogs',(req,res)=>
{
 
   const blog =new Blog(req.body);
   blog.save()
   .then((result)=>
   {
    res.redirect('/blogs')
   })
   .catch(err=> console.log(err));
})
app.get('/blogs/create',(req,res)=>
{
    res.render('create');
})
app.get('/blogs/:id',(req,res)=>
{
  const id=req.params.id;

  Blog.findById(id)
  .then((result)=>
  {
    res.render('details',{blog:result,name:"Deatils of the Blog"})
  })
  .catch(err=>{
    console.log(err);
  })
})
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});
app.get('/about',(req,res)=>
{
  res.render('about',{name:'rem'});
})


app.use((req,res)=>
{
res.render("404");
})