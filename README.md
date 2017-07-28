# Node Blog

## Project Details

This is the results of a daily assignment from The Iron Yard that I took well beyond the minimum requirements.

### Things to know

Npm installs required:

- body-parser
- ejs
- express
- method-override
- mongoose

This is your basic Express app running MongoDB. This app follows the CRUD model, to Create, Read, Update, and Delete blog posts.

The script.js and style.css files are in the public directory. If this app is running on your local machine, it can be found at localhost://3000.

The index route redirects to /blogs, and renders the index.ejs file. All blogposts are loaded using the BlogPost.find() method.

The new route renders the new.ejs file, where there is a form that posts to /blogs to create a new post. Posts on the /blogs route are rendered in order form newest to oldest.

The show route will render an individual blog post, using the .findById() method. The edit route also uses this method, but provides a form for editing, which will post to the update route. Body-parser is used to collect info from the form in the request body.

The findById method is also used to add comments to a particular blog post, as well as get a post to be deleted. The .put and .delete express functions are able to be used because of the npm package, method-override. 
