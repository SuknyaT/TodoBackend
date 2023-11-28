const mongoose = require('mongoose');
var todo = require('./todoSchema.js');
const url = `mongodb+srv://admin:QW6iqhYmnTUSNgky@cluster0.lghdxcz.mongodb.net/`;

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to the database ');
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n ${err}`);
  });
mongoose.set('strictQuery', true);

// Function to get file details from the database
const getTodoList = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const result = {};
    const totalTodos = await todo.countDocuments().exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalTodos = totalTodos;
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await todo.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    result.data = await todo
      .find()
      .sort('-_id')
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.rowsPerPage = limit;
    return res.json({ msg: 'Todos Fetched successfully', data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Sorry, something went wrong' });
  }
};

const addTodo = async (request, response) => {
  try {
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
      // ...
    });
  } catch (error) {
    console.log(error); 
  }
};

module.exports = {
  getTodoList,
  addTodo,
};
