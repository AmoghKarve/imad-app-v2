console.log('Loaded!');

var img = document.getElementById('madi');
var marginLeft = 0;
function moveright(){
    marginLeft = marginLeft + 10;
    marginLeft = marginLeft + 'px';
}
img.onclick = function () {
    var interval = setInterval(moveright,50);
};