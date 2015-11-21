Nodeíí (node-aye-aye or Sensei)
========

![alt text](http://craigrhoover.com/images/ayeaye.png "Aye Aye")

A sensible way to setup modern NodeJS Web Projects.

__Nodeíí__ is not a framework. It is a loose coupling of high-level services that will assist you in building applications. __Nodeíí__ includes some well-supported libraries to get you started but you can easily swap-out anything, anytime. __Nodeíí__ gives you the power to make your own decisions while helping lead the way.


__"Don't let your dependencies control your project! Sensei says, KISS"__
_____________________________________________________

Nodeíí is configured to use simple but well supported libraries:

- ExpressJS
- Waterline
- EJS Templating
- Lodash

Nodeíí separates concerns into a new type of structure that is explained further below.

Infrastructure
---------------
Infrastructure are the backend components.  In a traditional MVC structure, this would be limited to the __models__. In this framework, they are called __entities__.  Infrastructure encapsulates:

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

Pre-Compile of Anything
---------------
To reiterate, we don't care to touch any of your browser-based code.  That part is up to you.  Use Bower, Grunt or whatever you want. Use Less, SCSS, Coffeescript or anything of your liking (if you want strange dependent Ruby Gems). 

We believe that you should be already writing clean, concise code and don't need those libraries but everyone has a flavor.

Testing
---------------
We get you started with basic testing using __mocha__.  We created a folder called _tests_ in the __infrastructure__ folder.  You can add tests and run:

    make test


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

Copyright (c) 2015 Craig R. Hoover <crh3675 at gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.    
