
var playerArray = [],
	playerArraySize = 10,
	keyPresses = [],
	highlight = 5,
	selected = -1,
	money = 0,
	manualSorts = 0;

var unlocks = [
	{
		name : "money",
		req : 1,
		active: false,
		effect : function(){
			this.active = true;
			this.rewardElement = document.createElement("p");
			this.rewardElement.innerHTML = "Reward: " + money;
			document.getElementById("mainGame").appendChild(this.rewardElement);
			this.update = function(){
				this.rewardElement.innerHTML = "Reward: " + money;
			}
		}
	},
	{name : "somtin",
		req : 99999,
		active: false,
		effect : function(){
			this.rewardElement = document.createElement("p");
			this.rewardElement.innerHTML = "Reward: " + money;
			document.getElementById("mainGame").appendChild(this.rewardElement);
			this.update = function(){
				this.rewardElement.innerHTML = "Reward: " + money;
			}
		}},
	];

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

function shuffle(array) {
  var cIndex = array.length, tempValue, rndIndex;

  while (0 !== cIndex) {

    rndIndex = Math.floor(Math.random() * cIndex);
    cIndex -= 1;

    tempValue = array[cIndex];
    array[cIndex] = array[rndIndex];
    array[rndIndex] = tempValue;
  }

  return array;
}

function init(){
	var i = playerArraySize;

	while(i--){
		playerArray.push(i);
	}
	playerArray = shuffle(playerArray);
}

function select(){
	selected = highlight;
}

function swap(array, a, b){
	var temp = array[b];
	array[b] = array[a];
	array[a] = temp;
}

function checkUnlock(){
	for(var a = 0; a < unlocks.length; a++){
		if(!unlocks[a].active && manualSorts >= unlocks[a].req){
			unlocks[a].effect();
		}
	}
}

function checkIfSorted(array){
	var i = 1,
		cur,
		last = array[0];
	while(i < array.length){
		cur = array[i];
		if(cur > last) return false;
		last = cur;
		i++
	}
	return true;
}


function update(){
	if(keyPresses[37]){
		if(highlight != 0)highlight--;
		keyPresses[37] = false;
	} else if(keyPresses[39]){
		if(highlight != playerArray.length-1) highlight++;
		keyPresses[39] = false;
	} else if(keyPresses[32]){
		if(selected == -1)select(highlight);
		else {
			swap(playerArray,selected, highlight);
			highlight = selected;
			selected = -1;
		}
		keyPresses[32] = false;
	}
	if(checkIfSorted(playerArray))	{
		manualSorts++;
		money += 1;
		if(unlocks[0].active) unlocks[0].update();
		shuffle(playerArray);
		checkUnlock();
	}
}


function draw(){
	ctx.fillStyle = '#EABA6B';
	ctx.fillRect(0, 0, 500, 500);
	drawPlayerArray();
}

function drawPlayerArray(){
	for(i = 0; i < playerArray.length; i++){
		ctx.fillStyle = 'black';
		if(i == highlight){
			ctx.fillStyle = 'blue';
		}
		ctx.fillRect(i * (500 / playerArray.length), 500 - (playerArray[i] + 1) * (500 / playerArray.length), 500 / playerArray.length, (playerArray[i] + 1) * (500 / playerArray.length));
		
	}
}


function frame(timestamp){
	update();
	draw();

	window.requestAnimationFrame(frame);
}

window.addEventListener("keydown", function(event) {
	keyPresses[event.keyCode] = true;
});

init();
window.requestAnimationFrame(frame);