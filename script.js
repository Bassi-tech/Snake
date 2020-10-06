
window.onload = function()
{
	//------Variable local----------//
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var tps = 100;
	var tps2 = 100;
	var niska = new create_Snake([[6,4],[5,4],[4,4]],"right");
	var applle;
	var widthToBlocks = canvasWidth/blockSize; // Nombre de block en largeur
	var heightToBlocks = canvasHeight/blockSize; // Nombre de block en hauteur
	var score;
	var tpsout;
	var nbapple = 0;
	var tpsout2;
	//------------------------------//

	init();


	//-----Création du canvas et du serpent--------//
	function init ()
	{
		var canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height= canvasHeight;
		canvas.style.border = "10px solid black";
		canvas.style.margin = "50px auto";
		canvas.style.display = "block";
		canvas.style.backgroundColor = "grey"
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		applle = new apple([10,10]);
		score = 0;
		refreshCanvas();
	}
	//-------------------------------------------//

	//------Rafraichissement du canvas, dessin en avancement du serpent---//
	function refreshCanvas()
	{
		niska.advance();
		if (niska.checkCollision())
		{
			gameOver();
		}
		else
		{
			if(niska.isEatingApple(applle))
			{
				niska.ateApple = true;
				score++;
				nbapple++;
				/*if (nbapple === 5)
				{
					tps2 = tps2/2;
					nbapple = 0;
					tpsout2 = setTimeout(refreshCanvas,tps2);
				}*/
				do
				{
					applle.setNewPosition();
				}
				while (applle.isOnSnake(niska));
			}		
			ctx.clearRect(0,0,canvasWidth,canvasHeight);
			niska.draw();
			applle.draw();
			drawScore();
			tpsout = setTimeout(refreshCanvas,tps);

		}
	}
	//------------------------------------------------------------------//


	// Dessin du block du serpent--------------------------------------//
	function drawBlock(ctx,position)
	{
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect(x,y,blockSize,blockSize);
	}
	//----------------------------------------------------------------//

	//------Création du serpent---------------------------------------//

	function create_Snake(body,direction)
	{
		this.body = body;
		this.direction=direction;
		this.ateApple = false;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle = "#ff0000";
			for(var i = 0 ; i < this.body.length; i++)
			{
				drawBlock(ctx,this.body[i]);
			}
			ctx.restore();
		};

		this.advance = function()
		{
			var nexPosition = this.body[0].slice();// copie de la position de la tete avec slice
			switch(this.direction)
			{
				case "left":
					nexPosition[0]--;
					break;
				case "right" :
					nexPosition[0]++;
					break;
				case "down" :
					nexPosition[1]++;
					break;
				case "up" :
					nexPosition[1]--;
					break;
				default:
					throw("Invalid Direction");
			}

			this.body.unshift(nexPosition);	//placement de la nouvelle tete du serpent au debut du body avec unshift
			if(!this.ateApple)
				this.body.pop();
			else
				this.ateApple = false;
			
		};

		this.setDirection = function (newDirection){
			var allowedDirection;
			switch(this.direction)
			{
				case "left":
				case "right" :
					allowedDirection = ["up","down"];
					break;
				case "down" :
				case "up" :
					allowedDirection = ["left","right"];
					break;
			}
			if(allowedDirection.indexOf(newDirection) > -1 ){
				this.direction = newDirection
			} 
		};

		this.checkCollision = function()
		{
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0]; // Tete du serpent pour la collision
			var rest = this.body.slice(1); // Reste du corps du serpent
			var snakeX = head[0];//Position horizontal
			var snakeY = head[1];//Position vertical
			var minX = 0;
			var minY = 0;
			var maxX = widthToBlocks-1;
			var maxY = heightToBlocks-1;
			var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

			if (isNotBetweenVerticalWalls || isNotBetweenHorizontalWalls)
			{
				wallCollision = true;			
			}

			for ( var i = 0; i < rest.length; i++ )
			{
				if (snakeX === rest[i][0] && snakeY === rest[i][1]){
					snakeCollision = true;
				}
			}

			return wallCollision || snakeCollision;
		};

		this.isEatingApple = function(appleToEat)
		{
			var head = this.body[0];
			if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
				return true;
			else
				return false;
		};
	}

	function apple(position)
	{
		this.position = position;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle="#33cc33"
			ctx.beginPath();
			var radius = blockSize/2;
			var x = this.position[0]*blockSize+radius;
			var y = this.position[1]*blockSize+radius;
			ctx.arc(x,y, radius, 0,Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		};
		this.setNewPosition = function()
		{
			var newX = Math.round(Math.random() * (widthToBlocks-1));
			var newY = Math.round(Math.random() * (heightToBlocks-1));
			this.position = [newX,newY];

		};
		this.isOnSnake = function(snakeToCheck)
		{
			var isOnSnake = false;

			for (var i = 0 ; i < snakeToCheck.body.length; i++)
			{
				if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
				{
					isOnSnake = true;
				}
			}
				return isOnSnake;
		}
	}

	function gameOver()
	{
		ctx.save();
		ctx.fillText("Game Over",5,15);
		ctx.fillText("Appuyer sur la touche [Espace] pour rejouer",5,30);
		ctx.restore();
	}

	function restart()
	{
		niska = new create_Snake([[6,4],[5,4],[4,4]],"right");
	    applle = new apple ([10,10]);
	    score = 0;
	    clearTimeout(tpsout);
	    //clearTimeout(tpsout2);
	    clearTimeout
	    refreshCanvas();
	}

	function drawScore()
	{
		ctx.save();
		ctx.font ="bold 100px sans-serif";
		ctx.fillStyle="white";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		var centerX = canvasWidth/2;
		var centerY = canvasHeight/2;
		ctx.fillText(score.toString(),centerX,centerY);
		ctx.restore();
	}
	//-----------------------------------------------------------------//


//-------------Enregistrer la touche saisie par l'utilisateur---------//
document.onkeydown = function handleKeyDown(e)
{
	var key = e.keyCode;
	var newDirection;
	switch(key)
	{
		case 37:
			newDirection ="left";
			break;
		case 38:
			newDirection ="up";
			break;
		case 39:
			newDirection ="right";
			break;
		case 40:
			newDirection ="down";
			break;
		case 32:
			restart();
			return;
		default :
			return;
	}
	niska.setDirection(newDirection);
}
//-------------------------------------------------------------------//
}