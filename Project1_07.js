"use strict";

var canvas;
var gl;

var maxNumVertices  = 200;
var index = 0;

var cindex = 0;

var colors = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
];
var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];
var numVertices = 4; // automatically start with 4 vertices for rectangles
var filling = true; //the shapes start off filled
var clickNum=0; // counts the number of times you click the canvas

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function() {
       cindex = m.selectedIndex;
        });

	//The code below is to toggle the filling of the shapes when the button is clicked
	var f = document.getElementById("Fill")
	f.addEventListener("click", function(){
	if (filling==true){
		filling=false;
	}
	else{
		filling=true;
	}
    render();
	});

	//The code below changes the limit of the number of clicks you can use to make a shape
	//depending on which option is picked from the menu
	document.getElementById("shape").onclick = function(event) {
		switch (event.target.index) {
			case 0: 
				numVertices = 2; //the limit of clicks is 2 when line is clicked on in the menu
				break;
			case 1:
				numVertices  = 3; //the limit of clicks is 3 when triangle is clicked on in the menu
				break;
			case 2:
				numVertices = 4; //the limit of clicks is 4 when rectangle is clicked on in the menu
				break;
		}
	};
	
    canvas.addEventListener("mousedown", function(event){
        t  = vec2(2*event.clientX/canvas.width-1,
           2*(canvas.height-event.clientY)/canvas.height-1);
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

        t = vec4(colors[cindex]);

        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
		
		numIndices[numPolygons]++;
        index++;
		clickNum++; //this keeps track of clicks to compare it to numVertices
		
		if(numVertices==2 && clickNum==2){
			numPolygons++;
			numIndices[numPolygons] = 0;
			start[numPolygons] = index;
			render();
			clickNum=0;
		}
		else if(numVertices==3 && clickNum==3){
			numPolygons++;
			numIndices[numPolygons] = 0;
			start[numPolygons] = index;
			render();
			clickNum=0;
		}
		else if(numVertices==4 && clickNum==4){
			numPolygons++;
			numIndices[numPolygons] = 0;
			start[numPolygons] = index;
			render();
			clickNum=0;
		}
		
        
    } );


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

	if(filling){
		for(var i=0; i<numPolygons; i++) {
			//if this if else was not here then the lines would not show up when the filling is on
			if(numIndices[i]==2){
				gl.drawArrays( gl.LINE_LOOP, start[i], numIndices[i] );
			}
			else{
				gl.drawArrays( gl.TRIANGLE_FAN, start[i], numIndices[i] );
			}
		}
	}
	
	else{
		for(var i=0; i<numPolygons;i++){
			gl.drawArrays(gl.LINE_LOOP, start[i], numIndices[i]);
		}
	}
}
