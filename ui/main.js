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
var button = document.getElementById('counter');
button.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }  
    };
};
var counter = 0;

request.open('GET', ' http://amoghkarve.imad.hasura-app.io/counter');
request.send(null);
