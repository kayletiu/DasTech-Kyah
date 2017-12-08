var socket = io();
function enter(){
    
    var takename = document.getElementById("name").value;
    var enterbtn = document.getElementById("enter");
    var readybtn = document.getElementById("ready");
    readybtn.disabled = false;
    enterbtn.disabled = true;
    var newplayer = {
        name: takename
    };
	var movement = {
	  up: false,
	  down: false,
	  left: false,
	  right: false
	}
    var click = 1;
    document.addEventListener("click", function(event) {
      socket.emit('click', click);
    });
	document.addEventListener('keydown', function(event) {
	  switch (event.keyCode) {
		case 65: // A
		  movement.left = true;
		  break;
		case 68: // D
		  movement.right = true;
		  break;
	  }
	});
	document.addEventListener('keyup', function(event) {
	  switch (event.keyCode) {
		case 65: // A
		  movement.left = false;
		  break;
		case 68: // D
		  movement.right = false;
		  break;
	  }
	});
    socket.emit('new player', newplayer);
	setInterval(function() {
	  socket.emit('movement', movement);
	}, 1000 / 60);
}
function ready(){
    socket.emit('ready');
    var readybtn = document.getElementById("ready");
    readybtn.disabled = true;
}
