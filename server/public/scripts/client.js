$( document ).ready(onReady)

function onReady() {
  console.log('jQ');

  resultDisplay = false;
  getStuff();
  clearCalculator();

  // $('#submit').on('click', sendEquation)

  // event listeners for buttons
  $('.calc-button:not(#equals-btn)').on('click', processValue);
  $('#equals-btn').on('click', handleEquals);
}

function render(arr) {
  clearResults();
  for (let equation of arr) {
    $( '#results-history' ).prepend(`
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

// function sendEquation() {

//   $.ajax({
//     method: 'POST',
//     url: '/math',
//     data: {
//       num1: $('#num1').val(),
//       num2: $('#num2').val(),
//       oper: $('#operator').val()
//     }
//   }).then((res) => {
//     console.log('post request successful!');
//     clearInputs();
//     getStuff();
//   }).catch((err) => {
//     console.log('bro whatttt');
//   })

// }

function clearCalculator() {

  equationToSend = [];
  firstOperand = true;
  clearHighlight();
  
}

function clearHighlight() { $('.calc-button').removeClass('selected') }

function clearCalcDisplay() { $( '#number-display' ).empty() }

function processValue() {

  let val = $( this ).data('math'); // get button data

  if (val == undefined) { return false }; // filter out ghost buttons

  if (val == 'clear') { // if AC button is pressed:
    // clear entire operation and display
    clearCalculator(); 
    clearCalcDisplay();
    return false; // immediately exit processValue()
  }

  // if value is an operator:
  if (/[*+/-]/.test(val)) {

    // if this is our first operation, and current value isn't blank
    if (firstOperand && $( '#number-display' ).text() !== '') {
      $( this ).addClass('selected');
      handleOperator(val); // handle operator
    } else { // otherwise, throw error
      handleError('operand');
    }

  } else { // only possibility left is a number.
    
    if (resultDisplay) { // if we're still displaying the last result or operand,
      clearCalcDisplay(); // clear the display
      resultDisplay = false; // don't do this again until next result
    }

    $('#number-display' ).append(val); // append number to the calc display

  }
}

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

function handleOperator(operator) {
  pushOperand(); // push value to equation
  equationToSend.push(operator); // push operator to equation
  firstOperand = false; // prevent further operators
  resultDisplay = true;

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
    handleError('blank')
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

function clearInputs() {
  $( 'input' ).val('');
  $( 'select' ).val('');
}

function clearResults() { $( '#results-history' ).empty() };