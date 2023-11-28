// Import the necessary modules
const express = require('express'); // Import Express.js framework
const bodyParser = require('body-parser'); // Import body-parser middleware for parsing JSON and URL-encoded data
const app = express(); // Create an Express application instance
const port = 3000; // Set the port number for the server
const db = require('./queries'); // Import database query functions from the 'queries.js' file
var cors = require('cors') // Import cors middleware for handling cross-origin resource sharing

const corsOptions ={
  origin:'http://localhost:8000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
// Configure Express to use bodyParser for handling request bodies
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

// Define a route to handle the root URL '/'
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and MongoDB API' });
});

app.get('/todo/list', db.getTodoList);
app.post('/todo/create', db.addTodo);