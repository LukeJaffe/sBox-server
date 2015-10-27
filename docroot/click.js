setInterval(function(){
    var e = $.Event("keydown", { keyCode: 32}); //"keydown" if that's what you're doing
    $("body").trigger(e);
    },500); //call the function in a loop, forever, every 3500 milliseconds
