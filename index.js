// Import the necessary modules
const express = require('express'); // Import Express.js framework
const bodyParser = require('body-parser'); // Import body-parser middleware for parsing JSON and URL-encoded data
const app = express(); // Create an Express application instance
const port = 3000; // Set the port number for the server
const db = require('./queries'); // Import database query functions from the 'queries.js' file
const cors = require('cors'); // Import cors middleware for handling cross-origin resource sharing

// Configure Express to use bodyParser for handling request bodies
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));

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