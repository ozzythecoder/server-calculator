// set up express
const express = require('express');
const app = express();
const port = 5000;
app.use(express.static('server/public/'))

// set up body parser
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

let resultHistory = [
  {
    num1: 4,
    num2: 3,
    oper: '*',
    result: 12 },
  {
    num1: 5,
    num2: 2,
    oper: '+',
    result: 7 }
]

app.get('/print', (req, res) => {
  console.log('in /print route');
  res.send(resultHistory);
})

// set up listener
app.listen(port, () => {
  console.log('listening on port', port);
})