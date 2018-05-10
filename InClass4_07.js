"use strict";

var canvas;
var gl;

var pointsArray = [];

var fColor;
var red;
var green;
var blue;
var cyan;
var yellow;
var magenta;
var black;
var white;

var modelViewMatrix;
var modelViewMatrixLoc; 

var theta;
var theta2;
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

	theta=0;
	theta2=0;
    red = vec4(1.0, 0.0, 0.0, 1.0);
	green = vec4(0.0, 1.0, 0.0, 1.0);
	blue = vec4(0.0, 0.0, 1.0, 1.0);
    cyan = vec4(0.0, 1.0, 1.0, 1.0);
	yellow = vec4(1.0, 1.0, 0.0, 1.0);
	magenta = vec4(1.0, 0.0, 1.0, 1.0);
	white = vec4(1.0, 1.0, 1.0, 1.0);
	black = vec4(0.0, 0.0, 0.0, 1.0);

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
		modelViewMatrix = mult(scalem(.25, .25, .25), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateX(theta));
		modelViewMatrix = mult(translate(.5, -.5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(white));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.5, .5, .5), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateX(theta));
		modelViewMatrix = mult(translate(.5, -.5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(black));
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		//
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.25, .25, .25), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
		modelViewMatrix = mult(translate(-.5, .5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(black));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.5, .5, .5), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
		modelViewMatrix = mult(translate(-.5, .5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(white));
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		//
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.25, .25, .25), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateZ(theta));
		modelViewMatrix = mult(translate(-.5, -.5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(magenta));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.5, .5, .5), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateZ(theta2));
		modelViewMatrix = mult(translate(-.5, -.5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(yellow));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.75, .75, .75), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateZ(theta));
		modelViewMatrix = mult(translate(-.5, -.5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(cyan));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		//
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.25, .25, .25), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateZ(theta));
		modelViewMatrix = mult(translate(.5, .5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(green));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		theta2-=1.0;
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.5, .5, .5), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateZ(theta2));
		modelViewMatrix = mult(translate(.5, .5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(blue));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		
		theta+=1.0;
		modelViewMatrix = mat4();
		modelViewMatrix = mult(scalem(.75, .75, .75), modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, rotateZ(theta));
		modelViewMatrix = mult(translate(.5, .5, 0), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniform4fv(fColor, flatten(red));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	
        requestAnimFrame(render);
    }
