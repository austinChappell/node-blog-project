let express = require('express'),
    app = express(),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    BlogPost = require('./models/blogpost');

let port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/animal_blog');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

// INDEX ROUTE
app.get('/', function(req, res) {
  res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
  BlogPost.find({}, function(err, allPosts) {
    if (err) {
      console.log('SOMETHING WENT WRONG:');
      console.log(err);
    } else {
      res.render('index', {blogPosts: allPosts});
    };
  });
});

// NEW ROUTE
app.get('/new', function(req, res) {
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req, res) {
  console.log(req.body);
  let content = req.body.content;
  let formattedContent = content.split('\r\n');
  let newPost = {
    title: req.body.title,
    meta: {
      date: req.body.date
    },
    post: {
      image: req.body.image,
      stringContent: content,
      content: formattedContent
    },
    site: {
      name: req.body.citationName,
      url: req.body.citationUrl
    }
  };
  BlogPost.create(newPost, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {post});
    };
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log('SOMETHING WENT WRONG')
      console.log(err);
    } else {
      console.log('LOADING PAGE');
      console.log(post.post.stringContent);
      res.render('edit', {post});
    };
  });
});

// UPDATE ROUTE
app.put('/blogs/:id/edit', function(req, res) {
  let id = req.params.id;
  let content = req.body.content;
  let formattedContent = content.split('\r\n');
  let editedPost = {
    title: req.body.title,
    post: {
      image: req.body.image,
      stringContent: content,
      content: formattedContent
    },
    site: {
      name: req.body.citationName,
      url: req.body.citationUrl
    }
  };
  BlogPost.update({ _id: id }, editedPost, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect(`/blogs/${ id }`);
    };
  });
});

// ADD COMMENTS
app.post('/blogs/:id/comments', function(req, res) {
  let comment = req.body;
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      post.comments.push(comment);
      post.save();
      res.redirect('/blogs/' + id);
    };
  });
});

// DETLETE COMMENTS
app.delete('/blogs/:postId/comments/:commentId/delete', (req, res) => {
  let postId = req.params.postId;
  let commentId = req.params.commentId;
  console.log('postId: ', postId);
  console.log('commentId: ', commentId);
  BlogPost.findById(postId, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      console.log(post);
      let commentToDelete = post.comments.find(function findId(element) {
        return element._id == commentId;
      });
      console.log('COMMENTS ARRAY ----------', post.comments);
      console.log('THIS IS THE COMMENT TO DELETE ----------------', commentToDelete);
      let deleteIndex = post.comments.indexOf(commentToDelete);
      post.comments.splice(deleteIndex, 1);
      post.save();
      res.redirect(`/blogs/${ postId }/#comment-form`);
    };
  });
});

// DELETE ROUTE
app.get('/blogs/:id/delete', function(req, res) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, blogPost) {
    if (err) {
      console.log(err);
    } else {
      console.log(blogPost);
      res.render('delete', { blogPost });
    };
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', function(req, res) {
  let id = req.params.id;
  BlogPost.remove({ _id: id }, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  })
});

app.listen(port, function() {
  console.log(`Your server has started on PORT ${port}.`);
});
