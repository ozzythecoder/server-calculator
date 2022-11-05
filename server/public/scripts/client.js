$( document ).ready(onReady)

function onReady() {
  console.log('jQ');

  resultDisplay = false;
  getStuff();
  clearCalculator();

  // event listeners for calc buttons
  $('.calc-button:not(#equals-btn)').on('click', processValue);
  $('#equals-btn').on('click', handleEquals);

  // listener for delete history button
  $('#delete-history-btn').on('click', deleteHistory);
}

function render(arr) {
  let el = $( '#results-history' );

  const cuterOperators = { // adds the objectively cuter ÷ and × symbols
    '+': '+',
    '-': '-',
    '*': '&#215;',
    '/': '&#247;'
  }

  clearResults();

  for (let equation of arr) {
    el.prepend(`
      <p>${equation.num1} ${cuterOperators[equation.oper]} ${equation.num2} = ${equation.result}</p>
  `)}

}

function getStuff() { // get equation history from server

  $.ajax({
    method: 'GET',
    url: '/print'
  }).then( (res) => {
    render(res);
  }).catch( (err) => {
    console.log('render error!');
  })
}

function clearCalculator() { // clear calculator and client-side memory
  equationToSend = [];
  firstOperand = true;
  clearHighlight();
}

// clear various DOM elements
function clearHighlight() { $('.calc-button').removeClass('selected') }
function clearCalcDisplay() { $( '#number-display' ).empty() }
function clearResults() { $( '#results-history' ).empty() };

function processValue() { // process button press

  let btn = $( this );
  let val = $( this ).data('math'); // get button data
  let operRegex = /[*+/-]/ // to test operator

  // filter out ghost buttons
  if (val == undefined) {
    return false;

  } else if (val == 'clear') { // if AC button is pressed:
    clearCalculator(); // clear entire operation 
    clearCalcDisplay(); // and display
    return false; // immediately exit processValue()

  } else if (operRegex.test(val)) { // if value is an operator:
    handleOperator(btn, val); // handle operator & button highlight

  } else { // only possibility left is a number:

  if (resultDisplay) { // if we're still displaying the last result or operand,
    clearCalcDisplay(); // clear the display
    resultDisplay = false; // don't do this again until next result/operand
  }

  $('#number-display' ).append(val); // append number to the calc display

  } // end else if
} // end processValue()

function handleOperator(btn, operator) { // check if operator can be added to equation
  
  if (!pushOperand) { return false }; // check if operand is invalid

  // if the current value is not blank, and we haven't yet used an operator:
  if (firstOperand && $( '#number-display' ).text() !== '') {

    pushOperand();
    btn.addClass('selected'); // highlight button
    equationToSend.push(operator); // push operator to equation
    firstOperand = false; // prevent further operators
    resultDisplay = true; // clear display on next number input

  } else { // otherwise, throw error
    handleError('operand');
  }

}

function handleEquals() {  // push operand to array

  if (equationToSend.length < 2) { // if equation is incomplete, throw error
    handleError('operand');
    return false;
  } else if (!pushOperand()) { // if operand is invalid, reject equation
    return false;
  } else {
    sendEquals(); // the equation has passed the vibe check!
  }

}

function handleError(errorString) { // display errors

  const errors = {
    'operand': 'Sorry: this calculator only handles two values and one operator.',
    'blank': 'You must enter a value.',
    'length': 'Inputs cannot be more than seven digits long.'
  }

  console.log('error!', errors[errorString]);
  alert(errors[errorString]);
}

function pushOperand() { // determines end of the first operand
  let currentNum = $( '#number-display' ).text();

  if (currentNum == '') {
    handleError('blank');
    return false;
  } else if (currentNum.length > 7) {
    handleError('length');
    return false;
  } else {
    equationToSend.push(currentNum);
    return true;
  }

}

function sendEquals() { // equation is good - send it to the server

  let fullEquation = {  
    num1: equationToSend[0],
    num2: equationToSend[2], // gets sent in this order
    oper: equationToSend[1]
  }

  // app post request
  // send array

  $.ajax({
    method: 'POST',
    url: '/calc',
    data: fullEquation
  }).then( (res) => {
    console.log('equation posted to server');
    getLatest();
    getStuff();
  }).catch( (err) => {
    console.log('post error in sendEquals()');
  })

}

function getLatest() { // get most recent completed equation
  $.ajax({
    method: 'GET',
    url: '/latest'
  }).then ( (res) => {
    console.log('got latest equation!');
    appendResultToCalc(res);
  }).catch( (err) => {
    console.log('what!', err);
  })
}

function appendResultToCalc(object) { // display latest result on screen
  clearCalcDisplay();

  $( '#number-display' ).append(object.result); // append result to calc display
  resultDisplay = true; // calc display will not wipe on calc reset, but on first append

  clearCalculator();
  getStuff(); // get and render DOM
}

function deleteHistory() { // clear equation history from DOM and server
  // ajax delete request
  $.ajax({
    method: 'DELETE',
    url: '/delete'
  }).then( (res) => {
    console.log('deleted history');
    getStuff();
  }).catch( (err) => {
    console.log('delete request error in deleteHistory()');
  })
}
