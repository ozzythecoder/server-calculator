// set up express
const express = require('express');
const app = express();
const port = 5000;
app.use(express.static('server/public/'))

// set up body parser
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));





// set up listener
app.listen(port, () => {
  console.log('listening on port', port);
})