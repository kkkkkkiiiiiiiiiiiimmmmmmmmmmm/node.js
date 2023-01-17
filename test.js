const http = require("http");
const url = require("url");
const fs = require("fs");
let mysql = require("mysql");
const qs = require("querystring");

const port = 3001;

const server = http.createServer((req, res) => {
  const template = `<!DOCTYPE html>
  <html>
  <body>
  <h1>HTML DOM Events</h1>
  <h2>The onclick Event</h2>
  
  <p>The onclick event triggers a function when an element is clicked on.</p>
  <p>Click to trigger a function that will output "Hello World":</p>
  
  <button onclick="myFunction()">Click me</button>
  
  <p id="demo"></p>
  
  <script>
  function myFunction(event) {
    console.log(event);
  }
  </script>
  
  </body>
  </html>
  `;
  res.statusCode = 200;
  res.end(template);
});

server.listen(port);
