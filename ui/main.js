console.log('Loaded!');

/*var img = document.getElementById('madi');
var marginLeft = 0;
function moveright(){
    marginLeft = marginLeft + 10;
    img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function () {
    var interval = setInterval(moveright,50);
};*/
var counter = 0;
var button = document.getElementById('counter');
button.onclick = function () {
    counter = counter + 1;
    span.innerHTML = counter.toString();
}