window.onload = function()
{

	var canvasWidht = 900;
	var canvasHeigt = 600;
	var blockSize = 30;
	var ctx;
	var tps = 100;
	var niska;


	function init ()
	{
		var canvas = document.createElement('canvas');
		canvas.width = canvasWidht;
		canvas.height= canvasHeigt;
		canvas.style.border = "1px solid";
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		niska = new create_Snake([[6,4],[5,4],[4,4]]);
		refreshCanvas();
	}

	function refreshCanvas()
	{
		ctx.clearRect(0,0,canvasWidth,canvasHeight);
		niska.draw()
		setTimeout(refreshCanvas,tps);
	}

	function drawBlock(ctx,position)
	{
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect(x,y,blockSize,blockSize);
	}

	function create_Snake(body)
	{
		this.body = body;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle = red;
			for(var i = 0 ; i < this.body.length; i++)
			{
				drawBlock(ctx,this.body[i]);
			}
			ctx.restore();
		};
	}

	init();

}