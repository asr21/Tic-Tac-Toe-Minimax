var grid=new Array(9);
for (var i=0; i<9; i+=1)	{
	grid[i]=0;
}
var nextMove=9;
var gameResult=null;
window.onload=function()	{
	var player1=true;
	var player1checker=document.getElementById("r1");
	player1checker.onclick= function() {
		player1=true;
	}
	var player2checker=document.getElementById("r2");
	player2checker.onclick= function() {
		player1=false;
	}
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
	var td=document.getElementsByTagName('td');
	var tdCount=td.length;
	var numOfClicks=0;
	for(var i=0;i<tdCount;i++) {
		td[i].onmouseover= function() {
			var idx=this.dataset.idx;
			if(grid[idx]===0) {
				if(numOfClicks%2===0) {
					this.innerHTML="X";
				}
				else {
					this.innerHTML="O";
				}
			}
		}
		td[i].onmouseout= function() {
			var idx=this.dataset.idx;
			if(grid[idx]===0) {
				this.innerHTML="";
			}
        	}
		td[i].onclick= function() {
			var idx=this.dataset.idx;
			if(grid[idx]===0) {
        		if(numOfClicks%2===0)  {
					this.innerHTML="X";
					grid[idx]=1;
					numOfClicks++;
					if(player1) {
						var cpuMove=getCPUMove(grid,numOfClicks,diff);
						grid[cpuMove]=2;
						var mxd=document.getElementById(""+cpuMove+"");
						mxd.innerHTML="O";
						numOfClicks++;
					}
					displayResult(grid,numOfClicks);
				}
				else if(numOfClicks%2==1) {
					this.innerHTML="O";
					grid[idx]=2;
					numOfClicks++;
					displayResult(grid,numOfClicks);
				}
			}
			displayResult(grid,numOfClicks);
		}
	}
}
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

function getRandomnumber(board) {
	var cornersEmpty=false;
	for(var i=0;i<=8;i+=2)  {
		if(board[i]===0) {
			cornersEmpty=true;
		}
	}
	var randomNo;
	if(cornersEmpty)  {
		do {
		randomNo=Math.floor((Math.random() * 100) + 1)%5;
		} while (board[randomNo*2]!==0);
		return randomNo*2;
	}
	else {
		do {
			randomNo=Math.floor((Math.random() * 100) + 1)%9;
		} while (board[randomNo]!==0);
		return randomNo;
    }
}
function getscore(board,depth) {
  if(checkwin(board)==1) {
    return 10-depth;
  }
  else if(checkwin(board)==2) {
    return -10+depth;
  }
  else {
    return 0;
  }
}
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
function minimax(board,player1active,depth) {
  depth++;
  if(checkifgameover(board)) {
    return getscore(board,depth);
  }
  var scores=new Array();
  var moves=new Array();
  for(var i=0;i<9;i++) {
    if(board[i]===0) {
      board[i]=(player1active===true)?1:2;
      scores.push(minimax(board,!player1active,depth));
      board[i]=0;
      moves.push(i);
    }
  }
  var choice=-1;
  if(player1active) {
    var high=-20;
    for(var i=0;i<scores.length;i++) {
        if(scores[i]>high) {
          high=scores[i];
          choice=moves[i];
        }
    }
    nextMove=choice;
    return high;
  }
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
function getCPUMove(grid,numOfClicks,diff)
{
	var cpuMove=-1;
	if(diff)
	{
		if(numOfClicks==1) {
			if(grid[4]===0)  {
				cpuMove=4;
			}
			else {
				cpuMove=getRandomnumber(grid);
			}
    		}
    		else	{
			minimax(grid,false,0);
			cpuMove=nextMove;
		}
	}
	else
	{
		cpuMove=getRandomnumber(grid);
	}
	return cpuMove;
}
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
