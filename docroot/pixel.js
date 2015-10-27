function getPixel()
{
    var canvas = document.getElementById('testCanvas');
    var context = canvas.getContext('2d');
    for (i = 0; i < canvas.height; i++)
    {
        var row = context.getImageData(0,i,canvas.width,1).data;
        array = Array.prototype.slice.call(row);
        for (j = 0; j < 4*canvas.width; j+=4)
        {
            if (array[j] == 83 && array[j+1] == 56 && array[j+2] == 70)
            {
                console.log("bird: "+i)
            }
            else if (array[j] == 86 && array[j+1] == 58 && array[j+2] == 72)
            {
                console.log("pipe: "+i)
            }
        }
    }
}

function getGap()
{
    var canvas = document.getElementById('testCanvas');
    var context = canvas.getContext('2d');
    var row = context.getImageData(0,0,canvas.width,1).data;
    array = Array.prototype.slice.call(row);
    for (i = 0; i < 4*canvas.width; i+=4)
    {
        if (array[i] == 86 && array[i+1] == 58 && array[i+2] == 72)
        {
            //console.log("x: "+i/4)
            var col = context.getImageData(i/4,0,1,canvas.height).data;
            col_arr = Array.prototype.slice.call(col);
            for (j = 0; j < 4*canvas.height; j+=4)
            {
                if (col_arr[j] == 84 && col_arr[j+1] == 56 && col_arr[j+2] == 71)
                {
                    //console.log("y: "+j/4)
                    console.log(1)
                }
            }
            
        }
    }
}

function rowTest()
{
    var canvas = document.getElementById('testCanvas');
    var context = canvas.getContext('2d');
    var row = context.getImageData(0,0,canvas.width,1).data;
    array = Array.prototype.slice.call(row);
    console.log(1);
}

setInterval(function(){
    getGap();
},1); //call the function in a loop, forever, every 3500 milliseconds
