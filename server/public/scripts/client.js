$( document ).ready(onReady)

function onReady() {
  console.log('jQ');
  getStuff();
  $('#submit').on('click', doMath)
}

function getStuff() {
  $.ajax({
    method: 'GET',
    url: '/print'
  }).then( (res) => {
    console.log('successful render', res);
    render(res);
  }).catch( (err) => {
    console.log('butts :c');
  })
}

function render(arr) {
  for (let equation of arr) {
    console.log(equation);
    $( '#results-history' ).append(`
      ${equation.num1} ${equation.oper} ${equation.num2} = ${equation.result}<br>
  `)  
  }
}

function doMath() {
  console.log('in doMath');
}