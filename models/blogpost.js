let mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
  title: String,
  meta: {
    date: String
  },
  post: {
    image: String,
    stringContent: String,
    content: Array
  },
  site: {
    name: String,
    url: String
  },
  comments: [
    {
      text: String,
      author: String
    }
  ]
});

let BlogPost = mongoose.model('BlogPost', postSchema);

module.exports = BlogPost;
