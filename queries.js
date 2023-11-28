// Import necessary modules
const mongoose = require('mongoose');
var todo = require('./todoSchema.js');

// Database connection URL
const url = `mongodb+srv://admin:QW6iqhYmnTUSNgky@cluster0.lghdxcz.mongodb.net/`;

// Connect to the MongoDB database
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err}`);
  });

// Set mongoose to use strict query mode
mongoose.set('strictQuery', true);

// Function to get paginated Todo list
const getTodoList = async (req, res) => {
  try {
    // Extract pageNumber and limit from request query parameters or use default values
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 10;

    // Create an object to store paginated results
    const result = {};

    // Get total count of todos
    const totalTodos = await todo.countDocuments().exec();

    // Calculate pagination indexes
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;

    // Store totalTodos in the result object
    result.totalTodos = totalTodos;

    // Check if there's a previous page
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }

    // Check if there's a next page
    if (endIndex < (await todo.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }

    // Fetch paginated data from the database
    result.data = await todo
      .find()
      .sort('-_id')
      .skip(startIndex)
      .limit(limit)
      .exec();

    // Store rowsPerPage in the result object
    result.rowsPerPage = limit;

    // Return JSON response with fetched todos
    return res.json({ msg: 'Todos Fetched successfully', data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Sorry, something went wrong' });
  }
};

// Function to add a new Todo
const addTodo = async (request, response) => {
  try {
    // Create a new todo document and save it to the database
    new todo({
      name: request.body.name,
      description: request.body.description,
      type: request.body.type,
      status: request.body.status,
    }).save(function (err, res) {
      console.log(res);
      if (err) {
        response.status(200).json({ status: false, message: err });
      } else {
        response
          .status(200)
          .json({ status: true, message: 'Todo added successfully' });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Export functions for use in other files
module.exports = {
  getTodoList,
  addTodo,
};
