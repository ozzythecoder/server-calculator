// set up express
const express = require('express');
const app = express();
const port = 5000;
app.use(express.static('server/public/'))

// set up body parser
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set up global variables
let resultHistory = [];

const doTheMath = { // this will handle mathematical operations
  '+': function(a, b) { return a + b },
  '-': function(a, b) { return a - b },
  '*': function(a, b) { return a * b },
  '/': function(a, b) { return a / b }
}

// handle GET request - return array of previous operations
app.get('/print', (req, res) => {
  res.send(resultHistory);
})

app.post('/math', (req, res) => {
  // get data as an object
  let mathObj = req.body;

  // set the result equal to the operation of the two numbers,
  // performed by executing the function at the value of mathObj.oper
  // in the doTheMath object.
  //
  // example: doTheMath['+'](2, 4) would look at doTheMath['+'],
  // use 2 and 4 as arguments in that function, and return 6.

  mathObj.result = doTheMath[mathObj.oper](Number(mathObj.num1), Number(mathObj.num2))

  resultHistory.push(mathObj); // push completed object to the array
  res.sendStatus(200); // confirm post request
})

app.post('/calc', (req, res) => {
  
  let mathObj = req.body;

  // operation is performed:
  let longRes = doTheMath[mathObj.oper](Number(mathObj.num1), Number(mathObj.num2))

  console.log('long result is', longRes);

  mathObj.result = longRes.toString().substring(0,9) // limit result to 9 characters
  console.log('short result is', mathObj.result);
  resultHistory.push(mathObj)
  res.sendStatus(200);
})

app.get('/latest', (req, res) => {
  let lastResult = resultHistory[resultHistory.length - 1]
  res.send(lastResult);
})

app.delete('/delete', (req, res) => {

  resultHistory = [];
  res.sendStatus(200)
})

// set up listener
app.listen(port, () => {
  console.log('listening on port', port);
})