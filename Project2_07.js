"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var fColor;

var axis = 0;
var theta;

var indices = [];
var fill = true;
var faces = false;
var rotate = true;
var explode = false;

var modelViewMatrix;
var modelViewMatrixLoc; 

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
		
	colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	theta=0;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	fColor = gl.getUniformLocation(program, "fColor");
	
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    //event listeners for buttons

    document.getElementById( "rotate" ).onclick = function () {
		rotate = !rotate;
    };
	document.getElementById( "faces" ).onclick = function () {
		faces = !faces;
		points = []; //took me forever to realize I needed this for my if else to work
		colors = []; //same as above comment
		reinit(); //also needed a new canvas to go through everything to call colorcube(), etc. again
	}
	document.getElementById("fill").onclick = function () {
		fill=!fill;
		points = []; //same as above comments
		colors = [];
		reinit();
	}
	document.getElementById("explode").onclick = function () {
		explode=!explode;
	}
	
    render();
}

function reinit()
{
	 canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
		
	colorCube();
	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	//theta=0;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	fColor = gl.getUniformLocation(program, "fColor");
	
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
}

function colorCube(){
	quad( 1, 0, 3, 2 );
	quad( 2, 3, 7, 6 );
	quad( 3, 0, 4, 7 );
	quad( 6, 5, 1, 2 );
	quad( 4, 5, 6, 7 );
	quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex
	
	//below are the parts that caused me so much frustration when they wouldn't do anything when clicked
		if(fill==true){
			var indices = [ a, b, c, c, d, a ];
		}
		else{
			var indices = [ a, b, b, c, c, d, d, a ];
		}
		if(faces==false){
			for ( var i = 0; i < indices.length; ++i ) {
				points.push( vertices[indices[i]] );
				colors.push(vertexColors[a]);
			}
		}
		else if (faces==true){
			for ( var i = 0; i < indices.length; ++i ) {
				points.push( vertices[indices[i]] );
				colors.push( vertexColors[indices[i]] );
			}
		}
}


function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if(explode==false){
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
	}
	else if(explode==true){
		//top right
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(.5,.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(.5,.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//middle right
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(.5,0,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(.5,0,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//bottom right
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(.5,-.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(.5,-.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//top middle
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(0,.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(0,.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//middle middle
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(0,0,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(0,0,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//bottom middle
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(0,-.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(0,-.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//top left
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-.5,.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-.5,.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//middle left
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-.5,0,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-.5,0,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		//bottom left
		if(fill==false){
		
			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-.5,-.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.LINES, 0, NumVertices);
		
		}
		else if (fill==true){

			modelViewMatrix = mat4();
			modelViewMatrix = mult(modelViewMatrix, translate(-.5,-.5,0));
			modelViewMatrix = mult(modelViewMatrix, rotateY(theta));
			modelViewMatrix = mult(modelViewMatrix, rotateX(45));
			modelViewMatrix = mult(modelViewMatrix, scalem(.25,.25,.25));
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniform4fv(fColor, colors);
			gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
		}
		
	}
	
	if(rotate==true){
		theta+=2.0;
	}
	else if(rotate==false){
		theta=theta;
	}
	
    requestAnimFrame( render );
}
