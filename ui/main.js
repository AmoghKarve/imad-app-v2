console.log('Loaded!');

var img = document.getElementById('madi');
var marginLeft = 0;
function moveright(){
    marginLeft = marginLeft + 10;
    marginLeft = marginLeft + 'px';
}
img.onclick = function () {
    img.style.marginLeft='100px';
    var interval = setInterval(moveright,50);
};