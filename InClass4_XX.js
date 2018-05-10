"use strict";

var canvas;
var gl;

var pointsArray = [];

var fColor;
var red;
var green;
var blue;

var modelViewMatrix;
var modelViewMatrixLoc; 

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    red = vec4(1.0, 0.0, 0.0, 1.0);
	green = vec4(0.0, 1.0, 0.0, 1.0);
	blue = vec4(0.0, 0.0, 1.0, 1.0);

    // square
	
 	pointsArray.push(vec4( -0.5, -0.5, 0.0, 1.0));
	pointsArray.push(vec4( -0.5,  0.5, 0.0, 1.0));
	pointsArray.push(vec4(  0.5,  0.5, 0.0, 1.0));
	pointsArray.push(vec4(  0.5, -0.5, 0.0, 1.0));
	
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    render();
}

var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		modelViewMatrix = mat4();
		
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(red));

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	
        requestAnimFrame(render);
    }
