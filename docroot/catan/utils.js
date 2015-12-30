/* Math */
function feq(a, b) 
{
    if (Math.abs(a-b) < 1e-5)
        return true;
    else
        return false;
}

/* Events */
function addEvent(obj, type, fn) 
{
    if ( obj.attachEvent ) 
    {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
        obj.attachEvent( 'on'+type, obj[type+fn] );
    } 
    else
        obj.addEventListener( type, fn, false );
}

/* Graphics */
function clippedBackgroundImage(context, img, w, h)
{
    context.save(); // Save the context before clipping
    context.clip(); // Clip to whatever path is on the context

    var imgHeight = w / img.width * img.height;
    if (imgHeight < h)
    {
        context.fillStyle = '#000';
        context.fill();
    }
    context.drawImage(img,-w,-h,2*w,2*imgHeight);

    context.restore(); // Get rid of the clipping region
}

function clearCanvas( context, canvas ) 
{
    context.clearRect( 0, 0, canvas.width, canvas.height );
}
