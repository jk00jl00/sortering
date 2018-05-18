//document.getElementById("game").style.width = window.innerWidth * 0.2 + (500 - )


var playerArray = {},
	playerArraySize = 5,
	baseSize = 5,
	minimumLength = 5,
	keyPresses = [],
	highlight = 5,
	selected = -1,
	money = 0,
	manualSorts = 0;

const DIR = {FALLING: true, RISING: false},
	SHOPINDEX = {ELEMENTS: 0, TIMER: 1, CSS: 2, BUILDING: 3, QUEUE: 4, HINDECATOR: 5};



var minutes = 0,
	seconds = 0;


/*{
	name: ,
	cost: ,
	bought: ,
	active: ,
	element: ,
	req: function(){
		return true;
	},
	effect : function(){
		if(money >= this.cost){
			money -= this.cost;
			this.bought = true;
			this.active = false;
			
			document.getElementById("upgradeDiv").removeChild(this.element);
		}
	}
}*/



var shopItems = [
	{
		name : "More elements!",
		cost : 50,
		moneyReq : 9,
		amountBought : 0,
		bought : false,
		active : false,
		element : null,
		req : function(){
			return this.moneyReq <= money;
		},
		effect : function(){
			if(money >= this.cost){
 				money -= this.cost;
				this.cost += 10;
				this.active = false;
				this.moneyReq = this.cost - this.cost/4;
				playerArraySize = baseSize * Math.E **(0.35 * this.amountBought);
				this.amountBought ++;
				document.getElementById("upgradeDiv").removeChild(this.element);
			}
		}
	},
	{
		name : "timer",
		cost : 10,
		bought : false,
		active : false,
		element : null,
		time: {lastCheck: 0, h: 14, m: 37, d: 25, totalTime: "a", totalMinutes: 0},
		req : function() {
			return 5 < money;
		},
		effect : function(){
			if(money >= this.cost){
				this.bought = true;
 				money -= this.cost;
 				if(shopItems[2].bought) document.getElementById("upgradeDiv").style.height = 36.9 + "vh";
				document.getElementById("canvas").insertAdjacentHTML('beforebegin', timer);
				document.getElementById("upgradeDiv").removeChild(this.element);
				this.update = function(){
					this.time = getTime(this.time);
					document.getElementById("timer").innerHTML = this.time.totalTime;
				}
			}
		}
	},
	{
		name : "css",
		cost : 100,
		bought : false,
		active : false,
		element : null,
		styles : null,
		req : function() {
			return shopItems[SHOPINDEX.TIMER].bought && 50 < money;
		},
		effect : function (){
			if(this.cost <= money){
				this.bought = true;
				money -= this.cost;

				shopItems[SHOPINDEX.BUILDING].complex = document.createElement("div");
				shopItems[SHOPINDEX.BUILDING].complex.id = "buildings";
				shopItems[SHOPINDEX.BUILDING].complex.innerHTML = "<p id=\'buildingTitle\'></p>";

				document.getElementsByTagName("main")[0].insertBefore(shopItems[SHOPINDEX.BUILDING].complex, document.getElementsByTagName("main")[0].childNodes[0]);

				document.getElementById("upgradeDiv").removeChild(this.element);
				styles = document.createElement("style");
				styles.innerHTML = '*{\nuser-select: none;\n}\n\nhtml{\n	margin: 0;\n	padding: 0;\n	background: black;\n	font-size: 16px;\n}\n '+ 
					'body{\n	font-size: 62.5%;\n	background: white;\n}\n\nmain{\n	font-family: \'Share Tech\', sans-serif;\n	font-size: 3em;\n\n	text-align: center;\n\n	height: 100%;\n	width: 100%;\n overflow: hidden;\n\n}\n' + 
					'#buildings {\n	margin: 0 auto;\n	display: block;\n	border: 1px solid;\n	border-top: 0px solid;\n	width: 34.8%;\n	height: 98.2vh;\n	float: left;\n}\n\n#game {\n	margin: 0 auto;\n	display: block;\n' + 
					'border: 1px solid;\n	border-top: 0px solid;\n	width:30%;\n	height: 98.2vh;\n	float: left;\n}\n\n#selectArrayText{\n	position: absolute;\n	top: 300px;\n	margin: 0 auto;\n	width: 80%;\n' +	
					'display: none;\n	left: 50%;\n	right: 50%;\n 	transform: translate(-50%, 0);\n}\n\n#queue{\n	height: 47vh;\n	margin: 0px;\n	overflow-y: scroll;\n}\n\n.queueElement{\n	font-size: 0.6em;\n	width: 90%;\n' +	
					'margin: 0 auto;\n	border-bottom: 5px dashed;\n	display: block;\n	overflow: hidden;\n}\n\n#queueTitle{\n	margin-top: -7px;\n	display: inline;\n}\n\n.queuedName{\n	float: left;\n	margin-right: 5px;\n' +	
					'display: inline;\n}\n\n.queuedTime{\n	top:18px;\n	display: inline;\n	position: relative;\n}\n\n.queuedDir{\n	float: right;\n	display: inline;\n	position: relative;\n	right: 10px;\n}\n\n.selectedArray{\n' +	
					'margin-top: -5px;\n	border: 5px solid;\n}\n\n.selectedArray p{\n	margin-left: 5px;\n	margin-right: 5px;\n}\n\n#timer{\n	border-bottom: 2px solid;\n}\n\ncanvas{\n	width: 100%;\n	height: 50vh;\n}\n\n' + 
					'#shopDiv {\n	width: 34.8%;\n	height: 98.2vh;\n	margin: 0 auto;\n	display: block;\n	border: 1px solid;\n	border-right: 0px solid;\n	border-top: 0px solid;\n	float: left;\n	overflow: hidden;\n}' + 
					'\n\n#upgradeDiv::-webkit-scrollbar{\n  background: transparent;\n  width: 3px;\n}\n\n#upgradeDiv::-webkit-scrollbar-thumb{\n  background: black;\n  border-radius: 1px;\n}\n\n#queue::-webkit-scrollbar{\n  ' + 
					'background: transparent;\n  width: 3px;\n}\n\n#queue::-webkit-scrollbar-thumb{\n  background: black;\n  border-radius: 1px;\n}\n\n#upgradeDiv{\n	text-align: left;\n	width: 50%;\n	margin: 0 auto;\n' + 	
					'height: 33.2vh;\n	border: 4px solid;\n	overflow-y: scroll;\n}\n\n.shopItem{\n	margin-left: 5px;\n	margin-right: 5px;\n	font-size: 0.3em;\n	border-bottom: 2px dashed;\n}\n\n.shopItem p{\n	display: inline-block;' + 
					'\n}\n\n.shopItem:hover{\n	margin: 0px;\n	margin-top: -4px;\n	border-top: 4px solid;\n\n	border-bottom: 4px solid;\n}\n\n.shopItem:first-child:hover{\n	border-top: 0px solid;\n}\n\n.shopPrice{\n	' + 
					'float: right;\n	margin-right: 4px;\n}';
				document.getElementById("head").appendChild(styles); 
			}
		}
	},
	{
		name : "WIP",
		cost : 0,
		active : false,
		bought : false,
		element : null,
		styles : null,
		complex : null,
		req : function(){
			return 100 < money;
		},
		effect : function (){
			if(this.cost <= money){
				this.bought = true;
				money -= this.cost;
				document.getElementById("upgradeDiv").removeChild(this.element);

				document.getElementById("buildingTitle").innerHTML = "WIP";


			}
		}

	},
	{
		name : "Array Queue",
		cost : 5,
		bought : false,
		active : false,
		element : null,
		queue: null,
		max: 6,
		arrays: [],
		arraysInQueue: [],
		req : function() {
			return shopItems[SHOPINDEX.TIMER].bought && money >= 1;
		},
		effect : function (){
			if(this.cost <= money){
				this.bought = true;
				money -= this.cost;
				document.getElementById("upgradeDiv").removeChild(this.element);
				this.queue = document.createElement("div");
				this.queue.id = "queue";
				this.queue.innerHTML = "<p id=\'queueTitle\'>Queue</p>";

				if(shopItems[3].bought) document.getElementById("selectArrayText").style.transform = "translate(-50%, 0)";

				document.getElementById("game").insertBefore(this.queue, document.getElementById("game").lastChild);

				this.update = function(){
					for(let i = 0; i < this.arraysInQueue.length; i++){
						if(this.arraysInQueue[i].totalMinutes < shopItems[SHOPINDEX.TIMER].time.totalMinutes){
							this.arraysInQueue[i].element.childNodes[1].innerHTML = "Timed out";
						}
					}

					if(this.arrays.length < this.max){
						this.arrays.push({
							id: this.arrays.length,
							dir: (random(0,2) == 1),
							array:initArray(playerArraySize),
							time : [0, 0, 0],
							displayedInQueue: false,
							element: null,
							isSorted : false,
							totalMinutes: 0,
							name: 0,
							sorted: function(){
								for(let i = 0; i < shopItems[4].arraysInQueue.length; i++){
									if(shopItems[4].arraysInQueue[i].id == this.id) shopItems[4].arraysInQueue.splice(i, 1);
								}
								document.getElementById("queue").removeChild(this.element);

								if(this.totalMinutes > shopItems[SHOPINDEX.TIMER].time.totalMinutes)
									money += this.name;

								this.displayedInQueue = false;
								this.array = initArray(playerArraySize);
								this.element = null;
								this.isSorted = false;
								this.dir = (random(0,2) == 1);
								this.getRandomName();	
								this.getNewTime();
								playerArray = null;
							},
							getNewTime: function(){
								let h = 0,
									d = 0,
									m = 0,
		 							rndMod = random(this.name + 10 + this.array.length/2, this.name + 20 + this.array.length * 2);
			 					h = (shopItems[SHOPINDEX.TIMER].time.m + shopItems[SHOPINDEX.TIMER].time.h * 60 + shopItems[SHOPINDEX.TIMER].time.d * 60 * 24 ) + rndMod;
		 						this.totalMinutes = shopItems[SHOPINDEX.TIMER].time.totalMinutes + rndMod;

			 					m = h % 60;
			 					h = (h - m) / 60;

			 					if(h > 23){
			 						var temp = h;
			 						h = temp % 24;
			 						d = (temp - h)/24;
			 					}
									
								this.time = [h, m, d];
							},
							getRandomName: function(){
							    let u = unsortedness(this);

								this.name = random(u/2, u + 1);
							},
						});
						this.arrays[this.arrays.length - 1].getRandomName();
						this.arrays[this.arrays.length - 1].getNewTime();
					}

					for(let i = 0; i < this.arrays.length; i++){
						if(!this.arrays[i].displayedInQueue){
							this.displayInQueue(this.arrays[i]);
							this.arrays[i].displayedInQueue = true;
							this.arraysInQueue.push(this.arrays[i]);
						}
					}
				}
				this.update();
				selectArray(this.arrays[0]);
			}
		},
		displayInQueue : function(arrayObj){
			tempElem = document.createElement("div");
			tempElem.classList.add("queueElement");
			tempElem.innerHTML = "<p class=\'queuedName\'> L: " + arrayObj.array.length + ", R: " + arrayObj.name + "</p><p class=\'queuedTime\'>" +checkZeroes(arrayObj.time[0]) + 
				":" + checkZeroes(arrayObj.time[1]) + " / " + checkZeroes(arrayObj.time[2]) + "</p><p class=\'queuedDir\'> " + ((arrayObj.dir) ? "Falling" : "Rising") + "</p>";
			tempElem.onclick = function() {
				selectArray(arrayObj);
			}							
			arrayObj.element = tempElem;
			document.getElementById("queue").appendChild(tempElem);
		}

	},
	{
		name : "Height Indicator",
		cost : 200,
		active : false,
		bought : false,
		element : null,
		req : function(){
			return 150 < money;
		},
		effect : function (){
			if(this.cost <= money){
				this.bought = true;
				money -= this.cost;
				document.getElementById("upgradeDiv").removeChild(this.element);

			}
		}

	},
	{
		name: "Array Colours",
		cost: 20,
		bought: false,
		active: false,
		element: null,
		req: function(){
			return money >= 15;
		},
		effect : function(){
			if(money >= this.cost){
				money -= this.cost;
				this.bought = true;
				this.active = false;

				selectedColour = 'red';
				highlightColour = 'blue';

				
				document.getElementById("upgradeDiv").removeChild(this.element);
			}
		}
	}

];


function unsortedness(arrayObj){
	var index = 0;
	if(arrayObj.dir){
		for(let i = 0; i < arrayObj.array.length; i++){
			if((arrayObj.array.length - 1 - i) < arrayObj.array[i]){
				index += arrayObj.array[i] - arrayObj.array.length - 1 - i;
			} else {
				index += ((arrayObj.array.length - 1 - i) - arrayObj.array[i]);
			}
		}
	} else{
		for(let i = 0; i < arrayObj.array.length; i++){
			if(i < arrayObj.array[i]){
				index += arrayObj.array[i] - i;
			} else {
				index += i - arrayObj.array[i];
			}
		}
	}
	return index;
}


function checkZeroes(int){
	if(int < 10){
		return "0" + int;
	} else{
		return int;
	}
}

function getTime(lastTime){
	now = timestamp();
	lastTime.currentTime = now;
	dt = lastTime.currentTime - lastTime.lastCheck;
	while(dt > 1250){
		lastTime.totalMinutes++;
		lastTime.lastCheck += 1250;
		dt -= 1250;
		if(lastTime.m == 59){
			lastTime.m = 0;
			if(lastTime.h == 23){
				lastTime.h = 0;
				if(lastTime.d == 30){
					lastTime.d = 1;
				} else{
					lastTime.d++;
				}
			} else{
				lastTime.h++;
			}
		} else{
			lastTime.m ++;
		}
	}

	if(lastTime.h == 0){
		lastTime.totalTime = "Time: 00:";
	} else if(lastTime.h < 10){
		lastTime.totalTime = "Time: 0" + lastTime.h + ":";
	} else{
		lastTime.totalTime = "Time: " + lastTime.h + ":";
	}

	if(lastTime.m == 0){
		lastTime.totalTime += "00";
	} else if(lastTime.m < 10){
		lastTime.totalTime += "0" + lastTime.m;
	} else{
		lastTime.totalTime += lastTime.m;
	}

	if(lastTime.d < 10){
		lastTime.totalTime += " / date: 0" + lastTime.d;
	} else{
		lastTime.totalTime += " / date: " + lastTime.d;
	}

	return lastTime;
}


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
			this.rewardElement.classList.add("moneyText");
			document.getElementById("game").appendChild(this.rewardElement);
			this.update = function(){
				if(this.prevMoney != money){
					this.active = true;
					this.prevMoney = money; 
					this.rewardElement.innerHTML = "Reward: " + money;
				}
			}
		}
	},
	{name : "Shop",
		req : 1,
		active: false,
		activeItems : [], 
		boughtItems : [],

		effect : function(){
			this.active = true;
			this.rewardElement = document.createElement("div");
			this.rewardElement.innerHTML = "<p>Shop</p>";
			this.rewardElement.id = "shopDiv";
			document.getElementById("game").removeChild(unlocks[0].rewardElement);
			document.getElementsByTagName("main")[0].insertBefore(this.rewardElement,document.getElementsByTagName("main")[0].childNodes[3]);
			document.getElementById("shopDiv").appendChild(unlocks[0].rewardElement);
			this.upgradeDiv = document.createElement("div");
			this.upgradeDiv.id = "upgradeDiv";
			this.rewardElement.appendChild(this.upgradeDiv);
			this.update = function(){
				for(var i = 0; i < shopItems.length; i++){
					if(!shopItems[i].bought && !shopItems[i].active && shopItems[i].req()){
						this.activeItems.push(shopItems[i]);
						this.tempElement = document.createElement("div");
						this.tempElement.innerHTML = "<p>" + shopItems[i].name  + "</p>" + "<p class=\'shopPrice\'>" + shopItems[i].cost +"-:</p>";
						this.tempElement.classList.add("shopItem");
						this.tempElement.onclick = function (object){
							return function(){
								object.effect();
							}
						}(shopItems[i]);
						document.getElementById("upgradeDiv").appendChild(this.tempElement);
						shopItems[i].active = true;
						shopItems[i].bought = false;
						shopItems[i].element = this.tempElement;
					} else if(shopItems[i].active && shopItems[i].bought){
						var a = 0;
						while(a < this.activeItems.length){
							if(this.activeItems[a] == shopItems[i]){
								this.activeItems.splice(a, 1);
								this.boughtItems.push(shopItems[i]);
								shopItems[i].active = false;
							}
							a++;
						}
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
	foregroundColour = 'black';
	highlightColour = 'white';
	selectedColour = 'black';

var timer = '<div id=\'timer\'> timer </div>';

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

function initArray(length){
	var a = [];
	for(let i = 0; i < random(minimumLength, length + 1); i++){
		a.push(i);
	}
	shuffle(a);
	return a;
}

function selectArray(arrayObj){
	for(let i = 0; i < shopItems[SHOPINDEX.QUEUE].arraysInQueue; i++){
		shopItems[SHOPINDEX.QUEUE].arraysInQueue[i].element.classList.remove("selectedArray");
	}
	if(playerArray && playerArray.element) playerArray.element.classList.remove("selectedArray");
	this.playerArray = arrayObj;
	highlight = Math.floor(arrayObj.array.length/2);

	if(arrayObj.element){
		arrayObj.element.classList.add("selectedArray");
		document.getElementById("selectArrayText").style.display = "none";
		document.getElementById("selectArrayText").innerHTML = "Select an array"
	}

}

function init(){
	let i = playerArraySize;
	playerArray = {array:[], 
		isSorted: false, 
		dir:false,

	};

	while(i--){
		playerArray.array.push(i);
	}
	playerArray.array = shuffle(playerArray.array);
	highlight = random(0, playerArray.array.length);
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

function checkIfSorted(array, right){
	var i = 1,
		cur,
		last = array[0];
	if(right){	
		while(i < array.length){
			cur = array[i];
			if(cur > last){
				last = array[0];
				i = 0;
				return false;
			}
			last = cur;
			i++
		}
	} else{
		while(i < array.length){
			cur = array[i];
			if(cur < last){
				last = array[0];
				i = 0;
				return false;
			}
			last = cur;
			i++
		}
	}
	return true;
}

function random(min, max){
	return Math.floor(min + Math.random() * (max-min));
}


function update(){
	if(keyPresses[225]){
		if(keyPresses[97]){
			money += 500;
			keyPresses[97] = false;
		}
		if(keyPresses[98]){
			manualSorts += 500;
			keyPresses[98] = false;
		}
		if(keyPresses[99]){
			shopItems[SHOPINDEX.TIMER].time.totalMinutes = 0;
			keyPresses[99] = false;
		}
		if(keyPresses[100] && playerArray){
			checkIfSorted(playerArray.array, playerArray.dir);
			keyPresses[100] = false;
		}
		if(keyPresses[101]){
			checkUnlock();
			keyPresses[101] = false;
		}
		if(keyPresses[102]){

			keyPresses[102] = false;
		}
		if(keyPresses[103]){

			keyPresses[103] = false;
		}
		if(keyPresses[104]){

			keyPresses[104] = false;
		}
		if(keyPresses[105]){

			keyPresses[105] = false;
		}
	}

	if(playerArray){
		if(shopItems[SHOPINDEX.QUEUE].bought){
			for(let i = 0; i < shopItems[SHOPINDEX.QUEUE].arraysInQueue.length; i++){
				if(keyPresses[49 + i] && shopItems[SHOPINDEX.QUEUE].arraysInQueue[i]){ 
					if(keyPresses[17]){
						for(let a = 0; a < shopItems[SHOPINDEX.QUEUE].arraysInQueue.length; a++){
							if(shopItems[SHOPINDEX.QUEUE].arraysInQueue[a])shopItems[SHOPINDEX.QUEUE].arraysInQueue[a].element.classList.remove("selectedArray");
						}
						shopItems[SHOPINDEX.QUEUE].arraysInQueue[i].totalMinutes = 0;
						shopItems[SHOPINDEX.QUEUE].arraysInQueue[i].sorted();
						keyPresses[49 + i] = false;
						return;
					} else{
						selectArray(shopItems[SHOPINDEX.QUEUE].arraysInQueue[i]);
					}
					keyPresses[49 + i] = false;
				}
			}
		}

		if(keyPresses[37]){
			if(keyPresses[16]){
				if(highlight < 5){
					highlight = 0;
				} else{
					highlight -= 5;
				}
			}
			if(highlight != 0)highlight--;
			keyPresses[37] = false;
		} else if(keyPresses[39]){
			if(keyPresses[16]){
				if(highlight > playerArray.array.length - 6){
					highlight = playerArray.array.length - 1;
				} else{
					highlight += 5;
				}
			}
			if(highlight != playerArray.array.length-1) highlight++;
			keyPresses[39] = false;
		} else if(keyPresses[32]){
			if(selected == -1)select(highlight);
			else {
				swap(playerArray.array,selected, highlight);
				highlight = selected;
				selected = -1;
			}
			keyPresses[32] = false;
		}
		if(checkIfSorted(playerArray.array, playerArray.dir))	{
			manualSorts++;
			if(playerArray.sorted)
				playerArray.sorted();
			else {
				shuffle(playerArray.array);
				money += 1;
			}
			checkUnlock();
		} else if(playerArray.totalMinutes < shopItems[SHOPINDEX.TIMER].time.totalMinutes) {
			document.getElementById("selectArrayText").innerHTML = "Timed out";
			playerArray.sorted();
		}

		for(let i = 0; i < unlocks.length; i++){
			if(unlocks[i].update){
				unlocks[i].update();
			}
		}

		for(let i = 0; i < unlocks[1].boughtItems.length; i++){
			if(unlocks[1].boughtItems[i].update){
				unlocks[1].boughtItems[i].update();
			}
		}
	} else{

		if(shopItems[SHOPINDEX.QUEUE].bought){
			for(let i = 0; i < shopItems[SHOPINDEX.QUEUE].arraysInQueue.length; i++){
				if(keyPresses[49 + i] && shopItems[SHOPINDEX.QUEUE].arraysInQueue[i]){ 
					if(keyPresses[17]){
						for(let a = 0; a < shopItems[SHOPINDEX.QUEUE].arraysInQueue.length; a++){
							if(shopItems[SHOPINDEX.QUEUE].arraysInQueue[a])shopItems[SHOPINDEX.QUEUE].arraysInQueue[a].element.classList.remove("selectedArray");
						}
						shopItems[SHOPINDEX.QUEUE].arraysInQueue[i].totalMinutes = 0;
						shopItems[SHOPINDEX.QUEUE].arraysInQueue[i].sorted();
						keyPresses[49 + i] = false;
						return;
					} else{
						selectArray(shopItems[SHOPINDEX.QUEUE].arraysInQueue[i]);
					}
					keyPresses[49 + i] = false;
				}
			}
		}


		if(shopItems[4].bought){
			for(let i = 0; i < shopItems[4].arraysInQueue.length; i++){
				if(keyPresses[49 + i]) selectArray(shopItems[4].arraysInQueue[i]);
			}
		}

		for(let i = 0; i < unlocks.length; i++){
			if(unlocks[i].update){
				unlocks[i].update();
			}
		}

		for(let i = 0; i < unlocks[1].boughtItems.length; i++){
			if(unlocks[1].boughtItems[i].update){
				unlocks[1].boughtItems[i].update();
			}
		}
	}
}


function draw(){
	ctx.clearRect(0, 0, width, height);
	drawPlayerArray();
	ctx.fillStyle = foregroundColour;
}

function drawPlayerArray(){
	if(playerArray){
		for(i = 0; i < playerArray.array.length; i++){
			ctx.fillStyle = foregroundColour;
			if(i == highlight) ctx.fillStyle = highlightColour;
			else if(i == selected){ 
				ctx.fillStyle = selectedColour;
				if(shopItems[SHOPINDEX.HINDECATOR].bought) 
					ctx.fillRect(0, height - (playerArray.array[i] + 1) * (height / playerArray.array.length), width, 1);	
			}
			ctx.fillRect(i * (width / playerArray.array.length), 
				height - (playerArray.array[i] + 1) * (height / playerArray.array.length), width / playerArray.array.length, 
				(playerArray.array[i] + 1) * (height / playerArray.array.length));
			if(shopItems[SHOPINDEX.HINDECATOR].bought && i == highlight){
				ctx.fillRect(0, height - (playerArray.array[i] + 1) * (height / playerArray.array.length), width, 1);	
			}
		}
	} else {
		document.getElementById("selectArrayText").style.display = "block";
	}
}

function timestamp(){
	return new Date().getTime();
}

function frame(timestamp){
	update();
	draw();

	window.requestAnimationFrame(frame);
}

window.addEventListener("keydown", function(event) {
	if(event.keyCode != 116) event.preventDefault();
	keyPresses[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
	if(event.keyCode == 16 || event.keyCode == 17)	keyPresses[event.keyCode] = false;
});

shopItems[SHOPINDEX.TIMER].time.lastCheck = timestamp();
init();
checkUnlock();
window.requestAnimationFrame(frame);