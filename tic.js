//initializing a an array of size 9. 
//Could have used a 3*3 but using this for simplicity
//the grid variable is global
var grid=new Array(9);
for (var i=0; i<9; i+=1)	{
	grid[i]=0;
}
//nextMove - A global variable which is set by the function minimax.(The move which AI choses)
var nextMove=9;
//gameResult - A flag variable which is set when we have a result
var gameResult=null;
window.onload=function()	{
	//code to check if the game is 1 player or two player. Player1 is set to true if it is one player game else false. set as 1 player by default
	var player1=true;
	//r1 is id of the radio button for 1 player
	var player1checker=document.getElementById("r1");
	player1checker.onclick= function() {
		player1=true;
	}
	var player2checker=document.getElementById("r2");
	player2checker.onclick= function() {
		player1=false;
	}
	//code to set the difficulty. The game is set at hard by default
	var diff=true;
	if(player1)
	{
		var difficultyChecker=document.getElementById("r3");
		difficultyChecker.onclick= function() {
			diff=false;
		}
		var difficultyChecker1=document.getElementById("r4");
		difficultyChecker1.onclick= function() {
			diff=true;
		}
	}
	// there are basically 10 tds. First 9 td's represent all the options of the 3x3 grid. 10th TD is to display the result
	var td=document.getElementsByTagName('td');
	var tdCount=td.length;
	var numOfClicks=0;
	for(var i=0;i<tdCount;i++) {
		//when the mouse is hovered over one of the td. The value is set according to whose chance it is
		td[i].onmouseover= function() {
			// used datalements from HTML5 woohoo!!
			var idx=this.dataset.idx;
			//checking if the grid is internally empty or not. if grid[idx]=0 then empty, =1 then equal to X, =2 then equal to Y
			if(grid[idx]===0) {
				if(numOfClicks%2===0) {
					this.innerHTML="X";
				}
				else {
					this.innerHTML="O";
				}
			}
		}
		//code to undo whatever the above function did.
		td[i].onmouseout= function() {
			var idx=this.dataset.idx;
			if(grid[idx]===0) {
				this.innerHTML="";
			}
        	}
		// main code
		td[i].onclick= function() {
			var idx=this.dataset.idx;
			//check if the grid which user is clicking is empty or not. DONT SET THE VALUE IF IT IS NOT EMPTY!!!!
			if(grid[idx]===0) {
        		if(numOfClicks%2===0)  {
					this.innerHTML="X";
					grid[idx]=1;
					numOfClicks++;
					//the grid is internally set to 1 and X is displayed on the HTML page
					if(player1) {
						//code to get CPU move
						var cpuMove=getCPUMove(grid,numOfClicks,diff);
						grid[cpuMove]=2;
						var mxd=document.getElementById(""+cpuMove+"");
						mxd.innerHTML="O";
						numOfClicks++;
						//grid internally set to 2 and O is displayed on the screen
					}
					//a function is called to display the result. Basically checks if the game is over or not and then displays
					//the result
					displayResult(grid,numOfClicks);
				}
				else if(numOfClicks%2==1) {
					this.innerHTML="O";
					grid[idx]=2;
					numOfClicks++;
					//since numOfClicks is odd.It is O's chance and it is set
					displayResult(grid,numOfClicks);
				}
			}
			displayResult(grid,numOfClicks);
		}
	}
}
//function to check who won
//returns 1 if X wins
//returns 2 if O wins
//returns 3 if draw or game is not over
//all possible conditions are written using 8 ifs
// the eight posibilities are
//3 horizontal,3vertical and 2 diagonals
function checkwin(board) {
  if(board[0]!==0 && board[0]==board[1]&&board[1]==board[2]) {
    return board[0];
  }
  if(board[3]!==0 && board[3]==board[4]&&board[4]==board[5]) {
    return board[3];
  }
  if(board[6]!==0 && board[6]==board[7]&&board[7]==board[8]) {
    return board[6];
  }
  if(board[0]!==0 && board[0]==board[3]&&board[3]==board[6]) {
    return board[0];
  }
  if(board[1]!==0 && board[1]==board[4]&&board[4]==board[7]) {
    return board[1];
  }
  if(board[2]!==0 && board[2]==board[5]&&board[5]==board[8]) {
    return board[2];
  }
  if(board[0]!==0 && board[0]==board[4]&&board[4]==board[8]) {
    return board[0];
  }
  if(board[2]!==0 && board[2]==board[4]&&board[4]==board[6]) {
    return board[2];
  }
  return 3;
}
//it is a code to get a random number between 0 to 8.
// more priority is given to corners. so it first returns corner indices.
//iff all the corners are filled other indices are returned 
function getRandomnumber(board) {
	//code to check if corners are empty
	var cornersEmpty=false;
	for(var i=0;i<=8;i+=2)  {
		if(board[i]===0) {
			cornersEmpty=true;
		}
	}
	var randomNo;
	if(cornersEmpty)  {
		do {
		//generate random number then %5
		randomNo=Math.floor((Math.random() * 100) + 1)%5;
		} while (board[randomNo*2]!==0);
		return randomNo*2;
	}
	else {
		do {
			//since all corners are filled . generate random number then %9
			randomNo=Math.floor((Math.random() * 100) + 1)%9;
		} while (board[randomNo]!==0);
		return randomNo;
    }
}
//returns the score.Depth is added so that it isnt a fatalist player. http://neverstopbuilding.com/minimax explains it in a very good manner

function getscore(board,depth) {
  if(checkwin(board)==1) {
    return 10-depth;
    //return 10-depth if X is winning
  }
  else if(checkwin(board)==2) {
    return -10+depth;
  }
  else {
    return 0;
  }
}
//function check if somebody has won or all the values in grid are filled
function checkifgameover(board) {
  if(checkwin(board)==1||checkwin(board)==2) {
    return true;
  }
  else {
    for(var i=0;i<9;i++) {
      if(board[i]===0) {
        return false;
      }
    }
    return true;
  }
}
//THE MAIN AI
function minimax(board,player1active,depth) {
// incrementing depth whenever minimax is called. 
  depth++;
// return the score if game is over
  if(checkifgameover(board)) {
    return getscore(board,depth);
  }
// array to store the score for each possible scenario
  var scores=new Array();
// array to store the move for each possible scenario
// a better design would have been a hashmap
// with score->move
// it is doing the same thing
  var moves=new Array();
  for(var i=0;i<9;i++) {
    if(board[i]===0) {
     // setting board[i]=1(X) if player1 is playing . else =2(O)
      board[i]=(player1active===true)?1:2;
	// minimax is called with board[i] set to some value
      scores.push(minimax(board,!player1active,depth));
	// score from this scenario is stored in scores array and move is stored in moves array
      board[i]=0;
	// undo the move
      moves.push(i);
    }
  }
//finding the highest score from all possible score if player 1 is playing
  var choice=-1;
  if(player1active) {
    var high=-20;
    for(var i=0;i<scores.length;i++) {
        if(scores[i]>high) {
          high=scores[i];
          choice=moves[i];
        }
    }
	// the global variable nextmove is set over here
    nextMove=choice;
    return high;
  }
// finding the lowest score from all possible score if player 2 is playing
  else {
    var low=20;
    for(var i=0;i<scores.length;i++) {
        if(scores[i]<low) {
          low=scores[i];
          choice=moves[i];
        }
    }
    nextMove=choice;
    return low;
  }
}
//The below code is to get the CPU move
function getCPUMove(grid,numOfClicks,diff)
{
	var cpuMove=-1;
	if(diff)
	{
		// if difficulty is hard
		if(numOfClicks==1) {
			//if it is the first click minimax is not called. Instead the middle value 4 is returned. or else one of the corners is returnd
			//first CPU move is hardcoded beacuse calling minimax leads to 1-2 secs latency. Calling minimax at this stage leads to our code checking more than 100,000 posibilities
			if(grid[4]===0)  {
				cpuMove=4;
			}
			else {
				cpuMove=getRandomnumber(grid);
			}
    		}
		//after the first hardcoded move. Our AI is used for the remaining 3 moves.
    		else	{
			minimax(grid,false,0);
			//here the nextMove global variable is used
			cpuMove=nextMove;
		}
	}
	//if difficulty is easy. returns random moves
	else
	{
		cpuMove=getRandomnumber(grid);
	}
	return cpuMove;
}
// function to display the result on the page
function displayResult(grid,numOfClicks) {
	var result=document.getElementById('result');
	if(numOfClicks>=5 && gameResult===null) {
		var win=checkwin(grid);
		if(win==1) {
			gameResult="X wins";
		}
		else if(win==2) {
            gameResult="O wins";
		}
		else if(checkifgameover(grid) && win==3)
		{
			gameResult="It is a draw";
		}
		result.innerHTML=gameResult;
	}
}
