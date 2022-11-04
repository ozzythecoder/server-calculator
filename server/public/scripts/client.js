$( document ).ready(onReady)

function onReady() {
  console.log('jQ');
  getStuff();
  $('#submit').on('click', sendEquation)
}

function render(arr) {

  clearResults();

  for (let equation of arr) {
    $( '#results-history' ).prepend(`
      ${equation.num1} ${equation.oper} ${equation.num2} = ${equation.result}<br>
  `)
  }

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

function clearInputs() {
  $( 'input' ).val('');
  $( 'select' ).val('');
}

function clearResults() { $( '#results-history' ).empty() };