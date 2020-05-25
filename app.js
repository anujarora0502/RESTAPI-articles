const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const ejs = require("ejs");

const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true , useUnifiedTopology: true });

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
.get((req,res)=>{

  Article.find({},(err,result)=>{
    if(!err){
      res.send(result);
    }else{
      res.send(err);
    }
  })
})
  .post((req,res)=>{
     const newArticle = new Article({
       title: req.body.title,
       content:req.body.content
     });
     newArticle.save((err)=>{
       if(!err){
         res.send("Successfully added new article");
       }else{
         res.send(err);
       }
     })
  })

  .delete((req,res)=>{
    Article.deleteMany({},(err)=>{
      if(!err){
        res.send("Deleted all");
      }else{
        res.send(err);
      }
    });
  });

                      ////////////////////////////// Specific Route


app.route("/articles/:title")
.get((req,res)=>{

  Article.findOne({title:req.params.title},(err,result)=>{
    if(result){
      res.send(result);
    }else{
      res.send("Not Found");
    }
  })

})

.put((req,res)=>{
  Article.update(
    {title: req.params.title}, //conditions
    {title: req.body.title, content: req.body.content}, //updates
    {overwrite: true},
    (err)=>{
      res.send("Success");
    }

  )
})

.patch((req,res)=>{

    Article.update(
      {title: req.params.title},
      {$set:req.body},
      (err)=>{
        if(!err){
          res.send("Patch successful");
        }else{
          req.send(err);
        }
      }
    )

})

.delete((req,res)=>{
   Article.deleteOne(
     {title: req.params.title},
     (err)=>{
       if(!err){
         res.send("successful delete op");
       }else{
         req.send(err);
       }
     }
   )

});



app.listen(3000, ()=>{

  console.log("Server is running at port 3000 if you are using local host");
})
