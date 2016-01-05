/* Game Class */
function Game()
{
    /* Game code */
    var canvas, context;

}

/* Main setup function */
Game.prototype.setup = function()
{
    x0 = 350;
    y0 = 350;
    r = 55;

    a = r*0.5;
    b = r*Math.sqrt(3)/2;

    num_hexes = 19;

    resources = ['wood', 'wood', 'wood', 'wood',
                'wheat', 'wheat', 'wheat', 'wheat',
                'pasture', 'pasture', 'pasture', 'pasture',
                'ore', 'ore', 'ore',
                'brick', 'brick', 'brick',
                'desert'];

    rolls = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

    origins = 
    [ 
        [-2*b, -3*r], [0, -3*r], [2*b, -3*r],                    //First row
        [-3*b, -1.5*r], [-b, -1.5*r], [b, -1.5*r], [3*b, -1.5*r],//Second Row
        [-4*b, 0], [-2*b, 0], [0, 0], [2*b, 0], [4*b, 0],        //Third row
        [-3*b, 1.5*r], [-b, 1.5*r], [b, 1.5*r], [3*b, 1.5*r],    //Fourth row
        [-2*b, 3*r], [0, 3*r], [2*b, 3*r]                        //Last row
    ];

    water_origins = 
    [
        [-3*b, -4.5*r], [-b, -4.5*r], [b, -4.5*r], [3*b, -4.5*r],
        [-4*b, -3*r], [4*b, -3*r],                    
        [-5*b, -1.5*r], [5*b, -1.5*r],
        [-6*b, 0], [6*b, 0],        
        [-5*b, 1.5*r], [5*b, 1.5*r],    
        [-4*b, 3*r], [4*b, 3*r],       
        [-3*b, 4.5*r], [-b, 4.5*r], [b, 4.5*r], [3*b, 4.5*r]
    ];

    /* Shuffle indeces */
    resource_indices = [];
    roll_indices = [];
    for (var i = 0; i < num_hexes; i++)
    {
        resource_indices.push(i);
        if (i == num_hexes-1) break; 
        roll_indices.push(i);
    }
    shuffle(resource_indices);
    shuffle(roll_indices);

    roll_idx = 0;
    for (var i = 0; i < num_hexes; i++)
    {
        /* Get random indices */
        idx1 = resource_indices[i];
        idx2 = roll_indices[roll_idx];

        /* Create all needed hexes */
        if (resources[idx1] == 'desert')
        {
            hexes.push(new Hex(x0+origins[i][0], y0+origins[i][1], r, 
                new HexType('desert', 0)));
            robber_hex = i;
        }
        else    
        {
            hexes.push(new Hex(x0+origins[i][0], y0+origins[i][1], r, 
                new HexType(resources[idx1], rolls[idx2])));
            roll_idx += 1;
        }
    } 

    /* Add water hexes */
    for (var i = 0; i < water_origins.length; i++)
    {
        hexes.push(new Hex(x0+water_origins[i][0], y0+water_origins[i][1], r, 
            new HexType('water', 0)));
    }

    /* Get all road vertices */
    road_verts = [];
    for (var i = 0; i < hexes.length; i++)
        road_verts = road_verts.concat(hexes[i].roads); 
    road_verts = road_verts.unique_roads();

    /* Create road objects */
    for (var i = 0; i < road_verts.length; i++)
        roads.push(new Road(road_verts[i], r));

    /* Determine road adjacency */
    for (var i = 0; i < roads.length; i++)
        for (var j = 0; j < roads.length; j++)
            if (roads[i].adjacent(roads[j]) && i !== j)
                roads[i].add_adjacent(j);

    /* Get all vertices (for settlements/cities) */
    town_verts = [];
    for (var i = 0; i < hexes.length; i++)
        town_verts = town_verts.concat(hexes[i].verts);  
    town_verts = town_verts.unique_verts();

    /* Create town objects */
    for (var i = 0; i < town_verts.length; i++)
        towns.push(new Town(town_verts[i], r));

    /* Determine town->road adjacency */
    for (var i = 0; i < towns.length; i++)
        for (var j = 0; j < roads.length; j++)
            if (towns[i].adj_road(roads[j]))
                towns[i].add_adj_road(j);

    t = [0,0,0,0,0,0,0,0];
    for (var i = 0; i < towns.length; i++)
    {
        idx = towns[i].adj_roads.length;
        t[idx] += 1;
    }
    //console.log(t);

    /* Draw all hexes */
    for (var i = 0; i < hexes.length; i++)
        hexes[i].draw();

    /* Save the default canvas appearance */
    default_state = hexes[robber_hex].click(canvas, context);
}

/*** Ajax ***/

/* Get game name from session */
$.post("http://lucx.info/catan/get_game.php", 
function(response)
{
    $("#game_name").html(response);
});

/* Get players in game and their colors */
$.post("http://lucx.info/catan/get_players.php", 
function(response)
{
    /* Get player table */
    var table = document.getElementById("player_table");

    /* Parse response */
    var result = $.parseJSON(response);

    /* Draw html elements */
    for (var i = 0; i < result.length-1; i++)
    {
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = "<button style='background-color:#2F3738; color:white;'>"+result[i][0]+"</button>";
        var c = result[i][1];
        cell2.innerHTML = "<"+c+">_____</"+c+">";
    }
});


// get a reference to the board, and the drawing context
canvas  = document.getElementById('board');
if ( canvas && canvas.getContext ) 
{
    context = canvas.getContext('2d');
} 
else 
{
    // unsupported browser?
    alert("Couldn't get a reference to the HTML 5 canvas."
      + "\nYour browser doesn't appear to support this page.");
}


function Road(v, r)
{
    this.v1 = [v[0], v[1]];
    this.v2 = [v[2], v[3]];
    this.x = (v[0]+v[2])/2;
    this.y = (v[1]+v[3])/2;
    this.r = r;
    this.built = false;
    this.owner = "none";
    this.a = [];
}

Road.prototype.adjacent = function(road)
{
    if (
        (feq(this.v1[0], road.v1[0]) && feq(this.v1[1], road.v1[1])) ||
        (feq(this.v1[0], road.v2[0]) && feq(this.v1[1], road.v2[1])) ||
        (feq(this.v2[0], road.v1[0]) && feq(this.v2[1], road.v1[1])) ||
        (feq(this.v2[0], road.v2[0]) && feq(this.v2[1], road.v2[1]))
    )
        return true;
    else
        return false;
}

Road.prototype.add_adjacent = function(idx)
{
    this.a.push(idx);
}

Road.prototype.collision = function(x, y)
{
    dx = this.x - x;
    dy = this.y - y;
    dist = Math.sqrt((dx*dx) + (dy*dy));
    if (dist > this.r/3)
        return false;
    else
        return true;
}

Road.prototype.select = function()
{
    context.beginPath();
    context.arc(this.x, this.y, this.r/3, 0, 2*Math.PI);
    context.strokeStyle = '#FF0000';
    context.stroke();
}

Road.prototype.deselect = function()
{

}

Road.prototype.click = function()
{
    /* Draw road */
    context.beginPath();
    context.moveTo(this.v1[0], this.v1[1]);
    context.lineTo(this.v2[0], this.v2[1]);
    context.closePath();
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    context.stroke();  // Now draw our path

    /* Draw road */
    context.beginPath();
    context.moveTo(this.v1[0], this.v1[1]);
    context.lineTo(this.v2[0], this.v2[1]);
    context.closePath();
    context.strokeStyle = '#0000FF';
    context.lineWidth = 4;
    context.stroke();  // Now draw our path
    context.lineWidth = 1;

    /* Redraw towns/cities that touch road */

    /* Save the default canvas appearance */
    default_state = canvas.toDataURL();
}

function Town(v, r)
{
    this.v = v;
    this.x = v[0];
    this.y = v[1];
    this.r = r;
    this.built = false;
    this.owner = "none";
    this.adj_roads = [];
}

Town.prototype.adj_road = function(road)
{
    if (
        (feq(this.v[0], road.v1[0]) && feq(this.v[1], road.v1[1])) ||
        (feq(this.v[0], road.v2[0]) && feq(this.v[1], road.v2[1]))
    )
        return true;
    else
        return false;
}

Town.prototype.add_adj_road = function(idx)
{
    this.adj_roads.push(idx);
}

Town.prototype.collision = function(x, y)
{
    dx = this.x - x;
    dy = this.y - y;
    dist = Math.sqrt((dx*dx) + (dy*dy));
    if (dist > this.r/4)
        return false;
    else
        return true;
}

Town.prototype.select = function()
{
    context.beginPath();
    context.arc(this.x, this.y, this.r/4, 0, 2*Math.PI);
    context.strokeStyle = '#0000FF';
    context.stroke();
}

Town.prototype.click = function(build_town)
{
    /* Get vertices adjacent to town */
    verts = [];
    for (var i = 0; i < this.adj_roads.length; i++)
    {
        x = (roads[this.adj_roads[i]].x + this.x)/2;
        y = (roads[this.adj_roads[i]].y + this.y)/2;
        verts.push([x, y]);
    }
    
    /* Draw settlement shape based on num available verts */
    if (this.adj_roads.length == 2)
        verts.push([this.x, this.y])

    /* Draw triangle for town */
    context.beginPath();
    context.moveTo(verts[0][0], verts[0][1]);
    for (var i = 1; i < verts.length; i++)
    {
        context.lineTo(verts[i][0], verts[i][1]);
    }
    context.closePath();
    context.fillStyle = '#0000FF';
    context.fill();  // Now draw our path

    /* Draw outline for town */
    context.beginPath();
    context.moveTo(verts[0][0], verts[0][1]);
    for (var i = 1; i < verts.length; i++)
    {
        context.lineTo(verts[i][0], verts[i][1]);
    }
    context.closePath();
    context.strokeStyle = '#000000';
    context.stroke();  // Now draw our path

    /* Save the default canvas appearance */
    default_state = canvas.toDataURL();
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function roads_equal(a, b) 
{
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    c1 = true;
    for (var i = 0; i < a.length; ++i) 
        if (!feq(a[i], b[i])) c1 = false;
    c2 = true;
    var c = [b[2],b[3],b[0],b[1]];
    for (var i = 0; i < a.length; ++i) 
        if (!feq(a[i], c[i])) c2 = false;
    return c1 || c2;
}

Array.prototype.unique_roads = function() 
{
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) 
        for (var j = i+1; j < a.length; ++j) 
            if (roads_equal(a[i], a[j]))
                a.splice(j--, 1);

    return a;
};

function verts_equal(a, b) 
{
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) 
        if (!feq(a[i], b[i])) return false;
    return true;
}

Array.prototype.unique_verts = function() 
{
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) 
        for (var j = i+1; j < a.length; ++j) 
            if (verts_equal(a[i], a[j]))
                a.splice(j--, 1);

    return a;
};

/* Global variables */
hexes = [], roads = [], towns = [];
var default_state = 0;
var robber_hex = 0;
var build_road = false;
var build_town = false;
var build_city = false;
var build_card = false;
var place_robber = false;

addEvent(canvas, 'mousemove', function(e) 
{
    /* Get mouse position */
    var rect = canvas.getBoundingClientRect();
    var posx = e.clientX - rect.left;
    var posy = e.clientY - rect.top;

    /* Save current state */
    state_image = new Image();
    state_image.src = default_state;
    context.drawImage(state_image, 0, 0);

    /* Check posx and posy against hexes using concentric circles */
    if (place_robber)
        for (var i = 0; i < hexes.length; i++)
        {
            if (hexes[i].collision(posx, posy))
                hexes[i].select(context);
        }

    /* Check posx and posy against roads using concentric circles */
    if (build_road)
        for (var i = 0; i < roads.length; i++)
        {
            if (roads[i].collision(posx, posy))
                roads[i].select();
        }

    /* Check posx and posy against towns using concentric circles */
    if (build_town || build_city)
        for (var i = 0; i < towns.length; i++)
        {
            if (towns[i].collision(posx, posy))
                towns[i].select();
        }
});

addEvent(canvas, 'click', function(e) 
{
    /* Get mouse position */
    var rect = canvas.getBoundingClientRect();
    var posx = e.clientX - rect.left;
    var posy = e.clientY - rect.top;

    /* Save current state */
    state_image = new Image();
    state_image.src = default_state;
    context.drawImage(state_image, 0, 0);
    
    /* Check posx and posy against hexes using concentric circles */
    if (place_robber)
    {
        for (var i = 0; i < hexes.length; i++)
        {
            if (hexes[i].collision(posx, posy) && robber_hex !== i)
            {
                hexes[robber_hex].draw_roll(context);
                hexes[robber_hex].robber = false;
                hexes[i].click(canvas, context);
                if (hexes[robber_hex].t.resource == 'desert')
                    hexes[robber_hex].draw_desert();
                default_state = canvas.toDataURL();
                robber_hex = i;
            }
        }
    }

    /* Check posx and posy against roads using concentric circles */
    if (build_road)
    {
        for (var i = 0; i < roads.length; i++)
        {
            if (roads[i].collision(posx, posy))
                roads[i].click();
        }
        build_road = false;
    }

    /* Check posx and posy against towns using concentric circles */
    if (build_town || build_city)
    {
        for (var i = 0; i < towns.length; i++)
        {
            if (towns[i].collision(posx, posy))
                towns[i].click(build_town);
        }
        build_town = build_city = false;
    }
});

$("#road_button").click( function()
{
    build_road = true;
});

$("#town_button").click( function()
{
    build_town = true;
});

$("#city_button").click( function()
{
    build_city = true;
});

$("#card_button").click( function()
{
    if ($("#board_popup").prop("hidden") == true)
    {
        $("#board_shade").prop("hidden", false);
        $("#board_popup").prop("hidden", false);
    }
    else
    {
        $("#board_shade").prop("hidden", true);
        $("#board_popup").prop("hidden", true);
    }
});
