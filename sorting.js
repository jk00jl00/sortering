
var playerArray = [],
	playerArraySize = 5,
	keyPresses = [],
	highlight = 5,
	selected = -1,
	money = 0,
	manualSorts = 0;

var shopItems = [
	{
		name : "More elements!",
		cost : 10,
		req : 8,
		bought : false,
		active : false,
		element : null,
		effect : function(){
			if(money >= this.cost){
				this.bought = true;
				money -= this.cost;
				playerArraySize = 10;
				document.getElementById("shopDiv").removeChild(this.element);
				init();
			}
		} 
	}
];

var unlocks = [
	{
		name : "money",
		req : 1,
		prevMoney: 0,
		active: false,
		effect : function(){
			this.active = true;
			this.rewardElement = document.createElement("p");
			this.rewardElement.innerHTML = "Reward: " + money;
			document.getElementById("mainGame").appendChild(this.rewardElement);
			this.update = function(){
				if(this.prevMoney != money){
					this.prevMoney = money; 
					this.rewardElement.innerHTML = "Reward: " + money;
				}
			}
		}
	},
	{name : "Shop",
		req : 5,
		active: false,
		activeItems : [], 
		boughtItems : [],

		effect : function(){
			this.active = true;
			this.rewardElement = document.createElement("div");
			this.rewardElement.innerHTML = "Shop";
			this.rewardElement.id = "shopDiv";
			document.getElementById("mainGame").appendChild(this.rewardElement);
			this.update = function(){
				for(var i = 0; i < shopItems.length; i++){
					if(!shopItems[i].bought && !shopItems[i].active && money >= shopItems[i].req){
						this.activeItems.push(shopItems[i]);
						this.tempElement = document.createElement("p");
						this.tempElement.innerHTML = shopItems[i].name + " " + shopItems[i].cost + ":-";
						this.tempElement.onclick = function (object){
							return function(){
								object.effect();
							}
						}(shopItems[i]);
						document.getElementById("shopDiv").appendChild(this.tempElement);
						shopItems[i].active = true;
						shopItems[i].bought = true;
						shopItems[i].element = this.tempElement;
					}
				}
			}
		}
	},
];

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	height = canvas.height,
	width = canvas.width;

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
	playerArray = [];

	while(i--){
		playerArray.push(i);
	}
	playerArray = shuffle(playerArray);
	highlight = random(1, playerArray.length);
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

function checkIfSorted(array, bothWays){
	var i = 1,
		cur,
		last = array[0];
	while(i < array.length){
		cur = array[i];
		if(cur > last){
			last = array[0];
			i = 0;
			if(bothWays){
				while(i < array.length){
					cur = array[i];
					if(cur < last) return false;
					last = cur;
					i++;
				}
			} else return false;
		}
		last = cur;
		i++
	}
	return true;
}

function random(min, max){
	return Math.floor(min + Math.random() * (max-min));
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
	if(checkIfSorted(playerArray, true))	{
		manualSorts++;
		money += 1;
		shuffle(playerArray);
		checkUnlock();
	}

	for(var i = 0; i < unlocks.length; i++){
		if(unlocks[i].update){
			unlocks[i].update();
		}
	}

}


function draw(){
	ctx.fillStyle = '#EABA6B';
	ctx.fillRect(0, 0, width, height);
	drawPlayerArray();
	ctx.fillStyle = "black";
}

function drawPlayerArray(){
	for(i = 0; i < playerArray.length; i++){
		ctx.fillStyle = 'black';
		if(i == highlight) ctx.fillStyle = 'blue';
		else if(i == selected) ctx.fillStyle = 'red';
		ctx.fillRect(i * (width / playerArray.length), height - (playerArray[i] + 1) * (height / playerArray.length), width / playerArray.length, (playerArray[i] + 1) * (height / playerArray.length));
		
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