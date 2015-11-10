Nodeii (node-eye-eye or Sensei)
========
A sensible way to setup modern NodeJS Web Projects.

The key to this project is, do not abstract your way to the point of extinction! Abstraction is necessary but modularity isn't always needed. We loosely couple the services we include within the project in order for the developer to easily swap-out anything, anytime.

As a developer, __you__ should be able to control your dependencies, not the modules.

Sensei says, KISS.
_____________________________________________________
Nodeii is configured to use simple but well supported libraries:

- ExpressJS
- Waterline
- EJS Templating
- Lodash

Nodeii separates concerns into a new type of structure that is explained further below.

Infrastructure
---------------
Infrastructure are the backend components.  In a traditional MVC structure, this would be limited to the __models__. In this framework, they are called __entities__.  Infrastructure encapsulates:

- Entities
- Managers

Managers are backend service containers that manage business logic.  Imagine you want to expose a single service to manage Registrations.  This service may touch many models. This is the perfect place for placing complex business logic functions.

Interface
---------------
Interface is all of the view logic to send to the client.  In a traditional MVC structure, this would be __controllers__  and __views__. _Nodeii_ turns __interface__ into an encapsulated environment that contains:

- Routing
- Assets
- Views (EJS is installed, *you can swap for whatever you want; Jade, Mustache)
- Services
- Policies

It is our belief that __infrastructure__ should have minimal coupling and have no effect on how an __interface_ is built. The only connection from __interface__ to __infrastructure__ is the fact that __interface__ can invoke __entities__ in the processing files (formerly known as controllers for MVC folks). 

Best case scenario is that you create __managers__ to hide the __entities__ completely from the __interface__.  But we don't judge :-)

The _processing files_ (controllers) for __Nodeii__ merely resolves _routes_ to JS files that can also invoke *EJS templates to display their layout. Key point is that there is no convention for doing so, you can output your data anyway you want, we just include EJS for ease of integration with web apps.

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
