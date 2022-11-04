$( document ).ready(onReady)

function onReady() {
  console.log('jQ');
  getGlobalVars();
  getStuff();
  clearCalculator();


  $('#submit').on('click', sendEquation)

  // event listeners for buttons
  $('.calc-button').on('click', processValue);
}

function render(arr) {
  clearResults();
  for (let equation of arr) {
    $( '#results-history' ).prepend(`
      ${equation.num1} ${equation.oper} ${equation.num2} = ${equation.result}<br>
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

function sendEquation() {

  $.ajax({
    method: 'POST',
    url: '/math',
    data: {
      num1: $('#num1').val(),
      num2: $('#num2').val(),
      oper: $('#operator').val()
    }
  }).then((res) => {
    console.log('post request successful!');
    clearInputs();
    getStuff();
  }).catch((err) => {
    console.log('bro whatttt');
  })

}

function getGlobalVars() {
  let equationToSend = [];
  let firstOperand = true;
}

function clearCalculator() {

  equationToSend = [];
  firstOperand = true;
  $( '#number-display' ).empty();
  
}

function processValue() {

  let val = $( this ).data('math'); // get button data
  if (val == undefined) { return false }; // filter out ghost buttons
  if (val == 'clear') { // clears entire operation
    clearCalculator();
    return false; // exit function
  }
  
  if (val == '=') {
    if (pushOperand()) { // if operand is not blank
      sendEquals(); // time to do the math!
    }
    return false; // exit function
  }

  // test if value is an operator
  if (/[*+/-]/.test(val)) {
    console.log('operator button clicked');

    // if this is our first operation, and current value isn't blank
    if (firstOperand && $( '#number-display' ).text() !== '') {
      handleOperator(val); // handle operator
    } else { // otherwise, throw error
      handleError('operand');
    }

  } else { // it's a number.
    $('#number-display' ).append(val);
  }

}

function handleOperator(operator) {
  pushOperand(); // push value to equation
  equationToSend.push(operator); // push operator to equation
  firstOperand = false; // prevent further operators

  console.log(equationToSend);
}

function handleError(errorCode) {
  const errors = {
    'operand': 'This calculator handles two values and one operator - no more, no less.'
  }
  console.log('error!', errors[errorCode]);
  alert(errors[errorCode]);
}

function pushOperand() { // determines end of the first value
  let currentNum = $( '#number-display' ).text();

  if (currentNum == '') {
    handleError('blank')
    return false;
  } else {
    equationToSend.push(currentNum);
    $( '#number-display' ).empty();
    return true;
  }
}

function sendEquals() {

  console.log('in sendEquals');
  console.log('equation:', equationToSend);

  let fullEquation = {  
    num1: equationToSend[0],
    num2: equationToSend[1],
    oper: equationToSend[2]
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
  console.log('appendresulttocalc:', object.result);
}

function clearInputs() {
  $( 'input' ).val('');
  $( 'select' ).val('');
}

function clearResults() { $( '#results-history' ).empty() };