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

  clearResults();

  for (let equation of arr) {
    el.prepend(`
      <p>${equation.num1} ${equation.oper} ${equation.num2} = ${equation.result}</p>
  `)}

}

function getStuff() {
  $.ajax({
    method: 'GET',
    url: '/print'
  }).then( (res) => {
    render(res);
  }).catch( (err) => {
    console.log('butts :c');
  })
}

function clearCalculator() {

  equationToSend = [];
  firstOperand = true;
  clearHighlight();
  
}

function clearHighlight() { $('.calc-button').removeClass('selected') }

function clearCalcDisplay() { $( '#number-display' ).empty() }

function processValue() {

  let btn = $( this );
  let val = $( this ).data('math'); // get button data
  let operRegex = /[*+/-]/

  // filter out ghost buttons
  if (val == undefined) {
    return false;

  } else if (val == 'clear') { // if AC button is pressed:
    clearCalculator(); // clear entire operation 
    clearCalcDisplay(); // and display
    return false; // immediately exit processValue()

  } else if (operRegex.test(val)) { // if value is an operator:
    handleOperator(btn, val); // handle operator

  } else { // only possibility left is a number:

  if (resultDisplay) { // if we're still displaying the last result or operand,
    clearCalcDisplay(); // clear the display
    resultDisplay = false; // don't do this again until next result/operand
  }

  $('#number-display' ).append(val); // append number to the calc display

  } // end else if
} // end processValue()

function handleEquals() {
  // push operand to array
  
  // equals can only work if there are two values in the equation array
  // (an operand and an operator)
  
  if (!pushOperand() || equationToSend.length < 2) {
    handleError('operand');
  } else {
    sendEquals();
  }

}

function handleOperator(btn, operator) {
  console.log(btn, operator);
  
  // if the current value is not blank, and we haven't yet used an operator
  if (firstOperand && $( '#number-display' ).text() !== '') {

    pushOperand(); // push the non-blank value to equation
    btn.addClass('selected'); // highlight button
    equationToSend.push(operator); // push operator to equation
    firstOperand = false; // prevent further operators
    resultDisplay = true; // clear display on next number input

  } else { // otherwise, throw error
    handleError('operand');
  }

  console.log(equationToSend);
}

function handleError(errorCode) {
  const errors = {
    'operand': 'This calculator handles two values and one operator - no more, no less.',
    'blank': 'You must enter a value.'
  }
  console.log('error!', errors[errorCode]);
  alert(errors[errorCode]);
}

function pushOperand() { // determines end of the first operand
  let currentNum = $( '#number-display' ).text();

  if (currentNum == '') {
    handleError('blank');
    return false;
  } else {
    equationToSend.push(currentNum);
    return true;
  }

}

function sendEquals() {

  console.log('in sendEquals');
  console.log('equation:', equationToSend);

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
    console.log('post made!');
    getLatest();
    getStuff();
  }).catch( (err) => {
    console.log('fucky wucky');
  })

}

function getLatest() {
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

function appendResultToCalc(object) {
  clearCalcDisplay();

  $( '#number-display' ).append(object.result); // append result to calc display
  resultDisplay = true; // calc display will not wipe on calc reset, but on first append

  clearCalculator();
  getStuff(); // get and render DOM
}

function deleteHistory() {
  // ajax delete request
  $.ajax({
    method: 'DELETE',
    url: '/delete'
  }).then( (res) => {
    console.log('deleted history');
    getStuff();
  }).catch( (err) => {
    console.log('why do u hate me');
  })
}

function clearInputs() {
  $( 'input' ).val('');
  $( 'select' ).val('');
}

function clearResults() { $( '#results-history' ).empty() };