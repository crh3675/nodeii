NodeII (node-eye-eye or Sensei)
========
A sensible way to setup modern NodeJS Web Projects.

The key to this project is, do not abstract your way to the point of extinction! Abstraction is necessary but modularity isn't always needed. 

Sensei says, KISS.
_____________________________________________________
NodeII is built upon simple but well supported libraries:

- ExpressJS
- Waterline
- EJS Templating

NodeII separates concerns into a new type of structure that is explained further below.

Infrastructure
---------------
Infrastructure are the backend components.  In a traditional MVC structure, this would be limited to the __models__. In this framework, they are called __entities__.

Interface
---------------
Interface is all of the view logic to send to the client.  In a traditional MVC structure, this would be __controllers__  and __views__. _NodeII_ turns _interface_ into an encapsulated environments that contains:

- Routing
- Assets
- HTML Views (EJS)
- View Rendering Agents (Controllers for you MVC folks)
- Services (HTMLHelpers for RoR folks)

It is our belief that _infrastructure_ should have minimal coupling and have no effect on how an _interface_ is built. The only connection from _interface_ to _infrastructure_ is the fact that _interface_ can invoke _entities_ in the processing files (formerly known as controllers for MVC folks). 

The _processing files_ (controllers) for _NodeII_ merely resolve __routes__ to JS files that can also invoke EJS templates to display their layout. Key point is that there is no convention for doing so, you can output your data anyway you want, we just include EJS for ease of integration with web apps.

Clone this project and run:

> npm install
   
Then:

> node app.js