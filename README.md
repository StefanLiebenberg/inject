inject.js
======

Javascript instance injection. Source code for blog post found at
[http://stefan.artspace44.com/2013/javascript-injection/](http://stefan.artspace44.com/2013/javascript-injection/)

Ussage:
======


function PostController () {

}
inject.register(PostController, inject.Type.SINGLETON);


function User( username ) {
  this.name = username;
}
inject.register(PostController, inject.Type.INSTANCE);



function Post (username, content) {
   this.user = inject(User, username);
   this.controller = inject(PostController);
}


inject.create(Post, arguments);

