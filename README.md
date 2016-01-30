Nodeíí (node-aye-aye or Sensei)
========

![alt text](http://craigrhoover.com/images/asciiayeaye.png "Aye Aye")

A sensible way to setup modern NodeJS Web Projects. Be a builder, not an integrator.

Why not MVC?  MVC is an archaic design pattern. Built around 20 year-old technology, certain aspects might be viable, just not practical. Controllers become so bloated, even in the self proclaimed AngularJS.  It lacks the appropriate separation of real-world concerns.

Code should make sense from the gound-up, not just from a programmer level.  We aim to product a clean separation of concerns by providing a concept that breaks the MVC mold.

__Nodeíí__ is not a framework. Inspired by concepts used in [SailsJS](http://sailsjs.org/ "SailsJS"), it is a loose coupling of high-level services that will assist you in building applications. __Nodeíí__ includes some well-supported libraries to get you started but you can easily swap-out anything, anytime. __Nodeíí__ gives you the power to make your own decisions while helping lead the way.


__"Don't let your dependencies control your project! Sensei says, KISS"__
_____________________________________________________

Nodeíí is configured to use simple but well supported libraries:

- [ExpressJS](http://expressjs.com/ "ExpressJS")
- [Waterline](https://github.com/balderdashy/waterline "Waterline")
- [EJS Templating](https://github.com/tj/ejs "EJS")
- [Lodash](https://lodash.com/ "lodash")
- [Async](https://github.com/caolan/async "Async")

Nodeíí separates concerns into a new type of structure that is explained further below.

Infrastructure
---------------
Infrastructure are the backend components.  In a traditional MVC structure, this would be limited to the __models__. In this implementation, they are called __entities__.  Infrastructure encapsulates:

- Entities
- Managers

Managers are backend service containers that manage business logic.  Imagine you want to expose a single service to manage Registrations.  This service may touch many __entities__. This is the perfect place for placing complex business logic functions.

Interface
---------------
Interface is all of the view logic to send to the client.  In a traditional MVC structure, this would be __controllers__  and __views__. _Nodeíí_ turns __interface__ into an encapsulated environment that contains:

- Routing
- Assets
- Views (EJS is installed, *you can swap for whatever you want; Jade, Mustache)
- Services
- Policies

It is our belief that __infrastructure__ should have minimal coupling and have no effect on how an __interface__ is built. The only connection from __interface__ to __infrastructure__ is the fact that __interface__ can invoke __entities__ in the processing files (formerly known as controllers for MVC folks). 

Best case scenario is that you create __managers__ to hide the __entities__ completely from the __interface__.  But we don't judge :-)

The _processing files_ (controllers) for __Nodeíí__ merely resolve _routes_ to JS files that can also invoke *EJS templates to display their layout. Key point is that there is no convention for doing so, you can output your data with any templating engine that you want (EJS, Jade, Mustache, Handlebars, DIY) we just include EJS for ease of integration with web apps.

Browser-Based Frameworks
---------------
We don't care about your frontend frameworks. Add any framework (VanillaJS, Backbone, GWT, Ember, Knockout, Angular).  It is up to you, there are so many choices and we won't make them for you. 

Pre-Compile of Assets
---------------
To reiterate, we don't care to touch any of your browser-based code.  That part is up to you.  Use Bower, Grunt or whatever you want. Use Less, SCSS, Coffeescript or anything of your liking (if you want strange dependent Ruby Gems). 

We believe that you should be already writing clean, concise code and don't need those libraries but everyone has a flavor.

Testing
---------------
We get you started with basic testing using [mocha](https://mochajs.org/ "mocha").  We created a folder called _tests_ in the __infrastructure__ folder.  You can add tests and run:

    make test
    
Useful Web Integration Libraries
---------------
- Use [Web Sockets](http://socket.io/docs/) for real-time updates
- Use [Redis](https://github.com/luin/ioredis) for memory cache in clustered environments
- Use [iNotify](https://github.com/yuanchuan/node-watch) to watch files as they arrive (like AWS SNS)
- Use [Mongo](http://mongoosejs.com/) to store non-relational data (Waterline supports this already though)

Why [Shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap "Shrinkwrap")?
---------------
We have built this concept around the most-recent versions of the libraries as mentioned above.  You can always swap whatever you want but we want to instill the concept of managing dependencies at a project level.  You don't have to use NPM shrinkwrap, we just want your checkout and basic usage of this concept to be smooth and simple.

## Ready to get MVC out of your vocabulary?

Clone this project and run:

    npm install
   
Then:

    node app.js

In your browser:

    http://localhost:1337
    
License
---------------
(The MIT License)

Copyright (c) 2015,2016 Craig R. Hoover <crh3675 at gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.    
