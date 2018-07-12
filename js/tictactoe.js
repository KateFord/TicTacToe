window.onload = function() {watch()};
function watch() {
	btnDisabled("btnStop"); 
}

// Returns the winner of the roll as a string
function rollForTurn() {
	var minimum = 1;
	var maximum = 11;
    var first = "";
    var outputMsg = "";
	var outputMsgPlayers = "";
	
    diceRoll(); 
		
	var pOne = Math.floor(Math.random()*(maximum - minimum) + minimum);
	var pTwo = Math.floor(Math.random()*(maximum - minimum) + minimum);
    
	writeMsg("Player 1 rolled [" + pOne + "]<br>");
	outputMsg = "Player 1 rolled [" + pOne + "]<br> Player 2 rolled [" + pTwo + "]<br><br>";
	setTimeout(function() {writeMsg(outputMsg);}, 1000);
   
	// determine which player won the roll
    if (pOne > pTwo) {
    	first = "Player 1";
        setTimeout(function(){ outputMsg = outputMsg + "Player 1 wins, please select a square.";}, 2000);
    	setTimeout(function() {writeMsg(outputMsg);}, 2000);
    } else if (pOne < pTwo) {
    	first = "Player 2";
        setTimeout(function(){ outputMsg = outputMsg + "Player 2 wins, please select a square.";}, 2000);
    	setTimeout(function() {writeMsg(outputMsg);}, 2000);
    }
	
    return first;
}

//-------------------------------------------------------------------------------
// Initiate the game, roll for turn, reroll on ties & determine the active player
//-------------------------------------------------------------------------------
function startGame() {
	var avatarArray = getAvatars(); 
	p1Avatar = avatarArray[0];
	p2Avatar = avatarArray[1];
	
	var xTurn = 0;
	activePlayer = rollForTurn();
    if (activePlayer == "") { 
    	activePlayer = rollForTurn();
    }
	setTimeout(function() {hideGameMsg();}, 4000);
	
	var btn = document.getElementById('btnStart');
	btnDisabled(btn); 
	var btn = document.getElementById('btnStop');
	stopEnabled(btn); 

	var showPlayer = document.getElementById('showPlayer')
	showPlayer.innerHTML = activePlayer;
	showPlayer.style.color = "green";
}

// Styles the game buttons while they are disabled
function btnDisabled(btn) {
	btn.style.color = "fff";
	btn.style.border = "2px solid rgb(153, 153, 102)";
	btn.style.backgroundColor = "rgb(214, 214, 194)";
	btn.disabled = true;
}

// Styles the game buttons while they are disabled
function stopEnabled(btn) {
	btn.style.color = "#fff";
	btn.style.border = "2px solid rgb(204, 0, 0)";
	btn.style.backgroundColor = "rgb(255, 51, 51)";
	btn.disabled = false;
}

// Styles the game buttons while they are disabled
function startEnabled(btn) {
	btn.style.color = "#fff";
	btn.style.border = "2px solid rgb(0, 153, 0)";
	btn.style.backgroundColor = "rgb(57, 230, 0)";
	btn.disabled = false;
}

// Stop and reset the game
function stopGame() {
	hideGameMsg();
	var btn = document.getElementById('btnStart');
	startEnabled(btn);
	var btn = document.getElementById('btnStop');
	btnDisabled(btn);
	var showPlayer = document.getElementById('showPlayer')
	showPlayer.innerHTML = "Game Stopped";
	showPlayer.style.color='red';
	
	// Reset all squares to their initial empty state.
	var arrayO = document.getElementsByClassName("O");
	var arrayX = document.getElementsByClassName("X");
	for (var i=0; i<arrayO.length;i++) {
		arrayO[i].style.transform = "translateY(-100%)";
	}
	for (var i=0; i<arrayX.length;i++) {
		arrayX[i].style.transform = "translateY(100%)";
	}
	// Clear the running log of all game moves
	document.getElementById('boardState').innerHTML = "";
}

//-------------------------------------------------------------------------------
// Game message console functions
//-------------------------------------------------------------------------------
function showGameMsg() {
	document.getElementById('gameMsgBox').style.display = 'block';
}

function hideGameMsg() {
	clearMsg() 
	document.getElementById('gameMsgBox').style.display = 'none'; 
}

function writeMsg(txt) {
	showGameMsg();
	document.getElementById('gameMsg').innerHTML = txt;
}

function clearMsg() {
	document.getElementById('gameMsg').innerHTML = "";
}

// Checks the proposed avatar assignments in the configuration panel and prevents them
// from being the same.
function saveSettings() {
	var p1Index = document.getElementById("player1").selectedIndex;
    var p1Selected = document.getElementById("player1").options;
	var p2Index = document.getElementById("player2").selectedIndex;
    var p2Selected = document.getElementById("player2").options;

	if (p1Selected[p1Index].text == p2Selected[p2Index].text) {
		alert("Player 1 & Player 2 cannot both be "+ p1Selected[p1Index].text + ". Configuration has not been applied or saved.");
		document.getElementById("player1").selectedIndex = document.getElementById('p1Display').innerHTML;
		document.getElementById("player2").selectedIndex = document.getElementById('p2Display').innerHTML;
	} else {
		alert("Configuration has been applied and saved!");
		document.getElementById('p1Display').innerHTML=p1Selected[p1Index].text;
		document.getElementById('p2Display').innerHTML=p2Selected[p2Index].text;
	}
	writeMsg(outputMsg);
}

// Returns the currently assigned avatar for each player
function getAvatars() {
	var p1Avatar = document.getElementById("p1Display").innerHTML;
    var p2Avatar = document.getElementById("p2Display").innerHTML;
	var avatarArray = [p1Avatar,p2Avatar];
	return avatarArray;
}

// Returns the active player's avatar
function determineAvatar() {
	
	var avatarArray = getAvatars();
	var active = document.getElementById('showPlayer').innerHTML;
	p1Avatar = avatarArray[0];
	p2Avatar = avatarArray[1];
	if (active == "Player 1") {
		var paintAvatar = p1Avatar;
	} else if (active == "Player 2") {
		var paintAvatar = p2Avatar;
	}
	return paintAvatar; 
}

// Changes active player
function avatarPlaced() {
	var parseText = document.getElementById('gameMsg').innerHTML;
	var showPlayer = document.getElementById('showPlayer');
	
	if (parseText == "That's three in a row, Player 1 wins!" || parseText == "That's three in a row, Player 2 wins!"){
		showPlayer.innerHTML = "Game Stopped";
		showPlayer.style.color='red';
	}
	activePlayer = showPlayer.innerHTML;
	if (activePlayer == "Player 1") {
		showPlayer.innerHTML = "Player 2";
	} else {
		showPlayer.innerHTML = "Player 1";
	}
	check4Tie();
}

// With the current board array, checks the validity of proposed move
function check(info,square) {
	for (var i in info) {
    	var tempInfo = info[i].charAt(0); 
        if (tempInfo == square) {
        	return tempInfo;
        }
    }
}

// As squares are selected, checking to see if it has already been assigned. If not,
// record the new square with it's assigned avatar.
function recordMoves(square) {
	var proposedMove = square;
	var boardState = document.getElementById('boardState').innerHTML;
	var info = boardState.split(',');
	verdict = check(info,square);
	return verdict;
}

// Records and adds latest move to list of previous moves
function recordMove(currentMove) {
	var target = document.getElementById('boardState');
	var previousMoves = target.innerHTML;
	target.innerHTML = previousMoves+currentMove;
}

function checkForWinningConditions() {
	var squareArray = [];
	var target = document.getElementById('boardState');
	var info = target.innerHTML; 
	info = info.substring(1);
	info = info.split(',');
    info.sort(); 
    for (var i in info) {
    	squareArray.push(info[i].charAt(0));
    }
    // Check for winning conditions
	checkForEachWinningCondition(info,[0,1,2]);
    checkForEachWinningCondition(info,[3,4,5]);
    checkForEachWinningCondition(info,[6,7,8]);
    checkForEachWinningCondition(info,[0,3,6]);
    checkForEachWinningCondition(info,[1,4,7]);
    checkForEachWinningCondition(info,[2,5,8]);
    checkForEachWinningCondition(info,[6,4,2]);
    checkForEachWinningCondition(info,[0,4,8]);
	check4Tie();
}

// Checks board state for ties and act accordingly
function check4Tie() {
	var boardState = document.getElementById('boardState').innerHTML;
	boardState = boardState.substring(1); 
	boardState = boardState.split(','); 
	var check = document.getElementById('gameMsg').innerHTML;
	if(boardState.length >= 9 && check != "That's three in a row, Player 1 wins!" && check != "That's three in a row, Player 2 wins!") {
		var outputMsg = "Oh no! Nobody wins, it was a tie!";
		tieSound();
		writeMsg(outputMsg);
		setTimeout(function() {stopGame();}, 3000);
	}
}

// Whenever a win is detected, a message is written to the game console, styling is changed and sounds are played.
function winner(winDetected,winCon) {
	if (winDetected == "win") {
		var showme = winDetected;
		var activePlayer = document.getElementById('showPlayer').innerHTML;
		var txt2 = "That's three in a row, "+activePlayer+" wins!";
		writeMsg(txt2);
		var btn = document.getElementById('btnStart');
		startEnabled(btn);
		var btn = document.getElementById('btnStop');
		btnDisabled(btn);
		document.getElementById('showPlayer').innerHTML = "Game Stopped";
		glowBoard(winCon);
	} 
}

// Styles the winning squares to light up in celebration
function glowBoard(pos) {
	var index0 = pos[0];
	var index1 = pos[1];
	var index2 = pos[2];
	var squares = document.getElementsByClassName('square')
	for (var i=0;i<squares.length;i++){
		if (i == index0) {
			var bg1 = squares[i];
			blink();
			winSound();
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(244, 179, 66)';}, 100);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(244, 238, 66)';}, 200);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(197, 244, 66)';}, 300);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(122, 244, 66)';}, 400);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(66, 244, 235)';}, 500);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(244, 179, 66)';}, 600);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(244, 238, 66)';}, 700);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(197, 244, 66)';}, 800);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(122, 244, 66)';}, 900);
			setTimeout(function() {bg1.style.backgroundColor = 'rgb(66, 244, 235)';}, 1000);
			setTimeout(function() {bg1.style.backgroundColor = '#d7f3f7';}, 1100);
		} else if (i == index1) {
			var bg2 = squares[i];
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(66, 244, 235)';}, 100);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(122, 244, 66)';}, 200);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(197, 244, 66)';}, 300);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(244, 238, 66)';}, 400);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(244, 179, 66)';}, 500);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(66, 244, 235)';}, 600);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(122, 244, 66)';}, 700);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(197, 244, 66)';}, 800);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(244, 238, 66)';}, 900);
			setTimeout(function() {bg2.style.backgroundColor = 'rgb(244, 179, 66)';}, 1000);
			setTimeout(function() {bg2.style.backgroundColor = '#d7f3f7';}, 1100);
		} else if (i == index2) {
			var bg3 = squares[i];
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(244, 179, 66)';}, 100);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(244, 238, 66)';}, 200);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(197, 244, 66)';}, 300);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(122, 244, 66)';}, 400);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(66, 244, 235)';}, 500);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(244, 179, 66)';}, 600);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(244, 238, 66)';}, 700);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(197, 244, 66)';}, 800);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(122, 244, 66)';}, 900);
			setTimeout(function() {bg3.style.backgroundColor = 'rgb(66, 244, 235)';}, 1000);
			setTimeout(function() {bg3.style.backgroundColor = '#d7f3f7';}, 1100);
		}
	}
	setTimeout(function() {stopGame();}, 1200);
}

// Produce sounds for each occasion
function squareSound() { 
	var sound = document.getElementById("placeAvatar");
    sound.play();
	setTimeout(function() {sound.pause();}, 400);
	setTimeout(function() {sound.currentTime = 0;}, 500);
}
function tieSound() { 
	var sound = document.getElementById("tieGame");
	var check = document.getElementById('gameMsg').innerHTML;
    setTimeout(function() {sound.play();}, 500);
}
function winSound() { 
	var sound = document.getElementById("winGame");
	setTimeout(function() {sound.play();}, 500);
	setTimeout(function() {sound.pause();}, 2700); 
	setTimeout(function() {sound.currentTime = 0;}, 2800);
}
function diceRoll() { 
	var sound = document.getElementById("diceRoll");
	sound.play();
}

// Change the background color and allow to flash  for a win animation
function blink() {
	var body = document.getElementById('body');
	setTimeout(function() {body.style.backgroundColor = '#94f7ed';}, 100);
	setTimeout(function() {body.style.backgroundColor = '#94cef7';}, 200);
	setTimeout(function() {body.style.backgroundColor = '#94a6f7';}, 300);
	setTimeout(function() {body.style.backgroundColor = '#b094f7';}, 400);
	setTimeout(function() {body.style.backgroundColor = '#cc94f7';}, 500);
	setTimeout(function() {body.style.backgroundColor = '#e894f7';}, 600);
	setTimeout(function() {body.style.backgroundColor = '#f794d9';}, 700);
	setTimeout(function() {body.style.backgroundColor = '#f73881';}, 800);
	setTimeout(function() {body.style.backgroundColor = '#c6034e';}, 900);
	setTimeout(function() {body.style.backgroundColor = '#e00202';}, 1000);
	setTimeout(function() {body.style.backgroundColor = '#ffffff';}, 1100);
}

// Animate the "O" avatar
function animateO(selected) {
	selected.style.transform = (selected.style.transform == "translateY(-100%)" || null) ? "translateY(0)" : "translateY(-100%)";
}

// Animate the "X" avatar
function animateX(selected) {
	selected.style.transform = (selected.style.transform == "translateY(100%)" || null) ? "translateY(0%)" : "translateY(100%)";
}

// ---------------------------------------------------------------------------------
// Algorithms to find all winning conditions
// Iterate through the growing array during gametime searching for the existence of 
// index 0, index 1 and index 2 and once they they appear in the array, record their 
// avatars and compare all 3 for wining conditions.
// ----------------------------------------------------------------------------------
function checkForEachWinningCondition(info,squareArray) {
	
	var winDetected = "on";

	for (var i in info) {
		if (info[i].charAt(0) == squareArray[0].toString()) {
			var match0Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == squareArray[1].toString()) {
			var match1Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == squareArray[2].toString()) {
			var match2Avatar = info[i].charAt(1);
		}
	}

	if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
		if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
			winDetected = "win";
			winner(winDetected,squareArray);
			return;
		}
	}
	winner(winDetected,squareArray);
}

//---------------------------------------------------------------------------------------
// Function called from the on-click event 
// Identifies the square selected and checks for validity of proposed square.
// Paints the correct avatar for the active player, animates O and X. 
// Checks for winning conditions before passing turn to other player.
//---------------------------------------------------------------------------------------
function animateSquare(squareNumber) {
	var activePlayer = document.getElementById('showPlayer').innerHTML;
	if (activePlayer != "Game Stopped") { 
		var square = squareNumber.toString(); 
		
		var verdict = recordMoves(square);
		if (verdict == undefined) { 
			var paintAvatar = determineAvatar(); 
			var selected = document.getElementsByClassName(paintAvatar)[squareNumber]; 
			if (paintAvatar == "O") { 
				animateO(selected); 
			} else if (paintAvatar == "X") {
				animateX(selected); 
			}
			
			var currentMove = ","+square+paintAvatar;
			recordMove(currentMove);
			checkForWinningConditions();
			avatarPlaced(square,paintAvatar);
			squareSound();
		}
	}
}


