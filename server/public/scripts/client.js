$( document ).ready(onReady)

function onReady() {
  console.log('jQ');
  render();
  $('#submit').on('click', doMath)
}

function render() {
  $.ajax({
    method: 'GET',
    url: '/print'
  }).then( (res) => {
    console.log('successful render');
  }).catch( (err) => {
    console.log('butts :c');
  })
}

function doMath() {
  console.log('in doMath');
}