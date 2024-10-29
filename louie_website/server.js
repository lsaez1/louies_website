/* 
const http = require('http'); // Import the HTTP module
const fs = require('fs'); // Import the File System module
const path = require('path'); // Import the Path module for cross-platform compatibility
const db = require('./db'); // Import database connection from db.js

// Define the hostname and port
const hostname = '0.0.0.0'; // Use '0.0.0.0' to accept connections from any IP address
const port = 8000;

// Define the request processor function
function requestProcessor(req, res) {
  // Only serve the file for the root URL
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'public', 'index.html'); //this simplifies the file path
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
}

// Create the server
const webServer = http.createServer( requestProcessor );

// Make the server listen on the specified port and hostname
webServer.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/

const express = require('express'); // Import Express module
const path = require('path'); // Import the Path module for cross-platform compatibility
const db = require('./db'); // Import database connection from db.js
const { createUserFeedback } = require('./db'); // Import the createUserFeedback function from your database file
console.log(db);

const app = express();
const port = 8000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the src directory, accessible via /src
app.use('/src', express.static(path.join(__dirname, 'src')));

app.use(express.urlencoded({
  extended: true
})); // parse data in form POST requests

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
    //.sendfile is a helper function in express that reads the file, prepares then sends a corresponding HTTP response
});


//POST route that recieves form data. uses db function to save information to database. ** does not validate information**
app.post('/personal-details', async (req, res) => {
  const user = req.body;

  try { 
    await createUserFeedback(user);
    res.status(200).send('Form Data Successfully submitted');
  } catch (error) {  // Add error parameter here
    res.status(500).send('Error Processing User Data: ' + error.message);
  }
});



// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});
