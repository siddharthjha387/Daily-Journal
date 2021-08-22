const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const lodash = require('lodash');
let posts = [];

const homeStartingContent = "Looking for a story to read? How about one of these?";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/journalDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const blogsSchema = {
  title: String,
  text: String
};
const Blog = mongoose.model("Blog", blogsSchema);

const listSchema = {
  name: String,
  blogs: [blogsSchema]
}
const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {
  // console.log(posts);
  Blog.find(function (err, founditems) {
    res.render("home", {
      homeContent: homeStartingContent,
      post: founditems
    });
  })

})

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});



app.get("/contact", function (req, res) {
  res.render("contact", {
    contactC: contactContent
  });
});

app.get("/compose", function (req, res) {

  res.render("compose");
});

app.post("/compose", function (req, res) {

  const newBlog = new Blog({
    title: req.body.blogTitle,
    text: req.body.blogPost
  });
  console.log(" Successfully saved new Blog");
  newBlog.save(function (err) {
    if (!err)
      res.redirect("/");
  });


})
app.get("/delete", function (req, res) {
  res.render("delete");
});
app.post("/delete", function (req, res) {
  console.log(req.body);
  const Id = req.body.Id;
  const password = req.body.password;
  if (Id === "$$$$$$" && password == "$$$$$$") {
    Blog.findByIdAndRemove(req.body.postName, function (err) {
      if (err) {
        console.log("id not found");
        res.redirect("/");
      }
      else {
        console.log("Successfully deleted");
        res.redirect("/");
      }
    })
  }
  else {
    console.log("Wrong Credentials");
    res.redirect("/");
  }

});

app.get('/:postId', function (req, res) {
  console.log(req.params);
  var searchedId = req.params.postId;
  Blog.findOne({
    _id: searchedId
  }, function (err, findList) {
    res.render("post", {
      postTitle: findList.title,
      postContent: findList.text
    });
  })

})


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
