"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

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

var lightPosition = vec4(-1.0, -1.0, 3.0, 0.0 );
var lightAmbient = vec4(0.9, 0.9, 0.9, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 0.0, 1.0 );

//gold
var materialAmbient = vec4( 1, 0.1995, 0.0745, 1.0 );
var materialDiffuse = vec4( 1, 0.60648, 0.22648, 1.0);
var materialSpecular = vec4( 1, 0.555802, 0.366065, 1.0 );
var materialShininess = 10.0;

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 11;

var torsoId2 = 12;
var headId2  = 13;
var head1Id2 = 13;
var head2Id2 = 23;
var leftUpperArmId2 = 14;
var leftLowerArmId2 = 15;
var rightUpperArmId2 = 16;
var rightLowerArmId2 = 17;
var leftUpperLegId2 = 18;
var leftLowerLegId2 = 19;
var rightUpperLegId2 = 20;
var rightLowerLegId2 = 21;
var tailId2 = 22;

var torsoHeight = 5.0;
var torsoWidth  = 2.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.7;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.7;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth  = 1.5;
var tailWidth = 0.5;
var tailHeight = 2.0;

var walker=-7; //variable that makes the dog walk
var texasranger=0; //variable that makes the dog jump. The name is related to the variable above

var walker2 =7;
var texasranger2 = 0; 

var numNodes = 25;
var numAngles = 25;

var theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 0];
var theta2 = [-150, -170, -180, 0, -180, 0, -180, 0, -180, 0, 0, 0];

var stack = [];
var figure = [];
var figure2 = [];

var wag=false;
var wagflag=false;
var walkback=false;
var walkbackflag=false;
var walk=false;
var walkflag=false;
var jump=false;
var jumpflag=false;

var wag2=false;
var wagflag2=false;
var walkback2=false;
var walkbackflag2=false;
var walk2=false;
var walkflag2=false;
var jump2=false;
var jumpflag2=false;

for( var i=0; i<numNodes; i++){
	figure[i] = createNode(null, null, null, null);
	figure2[i] = createNode(null, null, null, null);
}

	
	
var vBuffer, nBuffer;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

//-------------------------------------------
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4();
	var m2 = mat4();
	
    switch(Id) {
	
    case torsoId:
		m = rotate(theta[torsoId], 0, 1, 0 );
		m2 = rotate(theta2[torsoId],0,1,0);
		figure[torsoId] = createNode( m, torso, null, headId );
		figure2[torsoId] = createNode(m2, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:
		m = translate(0.0, torsoHeight+0.5*headHeight, torsoHeight);
		m = mult(m, rotate(theta[head1Id], 1, 0, 0));
		m = mult(m, rotate(theta[head2Id], 0, 1, 0));
		m = mult(m, translate(0.0, -1+headHeight, 2.0));
		figure[headId] = createNode( m, head, leftUpperArmId, null);
		m2 = translate(0.0, torsoHeight+0.5*headHeight, torsoHeight);
		m2 = mult(m2, rotate(theta2[head1Id], 1, 0, 0));
		m2 = mult(m2, rotate(theta2[head2Id], 0, 1, 0));
		m2 = mult(m2, translate(0.0, -1+headHeight, 2.0));
		figure2[headId] = createNode( m2, head, leftUpperArmId, null);
    break;

    case leftUpperArmId:
		m = translate(-(torsoWidth/1.75), 0.5*torsoHeight, torsoHeight/2);
		m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
		m2 = translate(-(torsoWidth/1.75), 0.5*torsoHeight, torsoHeight/2);
		m2 = mult(m2, rotate(theta2[leftUpperArmId], 1, 0, 0));
		figure2[leftUpperArmId] = createNode( m2, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:
		m = translate(torsoWidth/1.75, 0.5*torsoHeight, torsoHeight/2);
		m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
		m2 = translate(torsoWidth/1.75, 0.5*torsoHeight, torsoHeight/2);
		m2 = mult(m2, rotate(theta2[rightUpperArmId], 1, 0, 0));
		figure2[rightUpperArmId] = createNode( m2, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:
		m = translate(-(torsoWidth/2.0), 0.5*torsoHeight, -torsoHeight/2);
		m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
		m2 = translate(-(torsoWidth/2.0), 0.5*torsoHeight, -torsoHeight/2);
		m2 = mult(m2 , rotate(theta2[leftUpperLegId], 1, 0, 0));
		figure2[leftUpperLegId] = createNode( m2, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
		m = translate((torsoWidth/2.0)-0.2, 0.5*torsoHeight, -(torsoHeight/2)+0.5);
		m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );
		m2 = translate((torsoWidth/2.0)-0.2, 0.5*torsoHeight, -(torsoHeight/2)+0.5);
		m2 = mult(m2, rotate(theta2[rightUpperLegId], 1, 0, 0));
		figure2[rightUpperLegId] = createNode( m2, rightUpperLeg, tailId, rightLowerLegId );
    break;

    case leftLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
		m2 = translate(0.0, upperArmHeight, 0.0);
		m2 = mult(m2, rotate(theta2[leftLowerArmId], 1, 0, 0));
		figure2[leftLowerArmId] = createNode( m2, leftLowerArm, null, null );
    break;

    case rightLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
		m2 = translate(0.0, upperArmHeight, 0.0);
		m2 = mult(m2, rotate(theta2[rightLowerArmId], 1, 0, 0));
		figure2[rightLowerArmId] = createNode( m2, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta2[leftLowerLegId], 1, 0, 0));
		figure2[leftLowerLegId] = createNode( m2, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta2[rightLowerLegId], 1, 0, 0));
		figure2[rightLowerLegId] = createNode( m2, rightLowerLeg, null, null );
    break;
	case tailId:
		m = translate(0.0, 3, -2);
		m = mult(m, rotate(theta[tailId], 1, 0, 0 ));
		figure[tailId] = createNode( m, tail, null, null );
		m2 = translate(0.0, 3, -2);
		m2 = mult(m2, rotate(theta2[tailId], 1, 0, 0 ));
		figure2[tailId] = createNode( m2, tail, null, null );
    break;
	
	case torsoId2:
		m = rotate(theta[torsoId], 0, 1, 0 );
		m2 = rotate(theta2[torsoId],0,1,0);
		figure[torsoId] = createNode( m, torso, null, headId );
		figure2[torsoId] = createNode(m2, torso, null, headId );
    break;

    case headId2:
    case head1Id2:
    case head2Id2:
		m = translate(0.0, torsoHeight+0.5*headHeight, torsoHeight);
		m = mult(m, rotate(theta[head1Id], 1, 0, 0));
		m = mult(m, rotate(theta[head2Id], 0, 1, 0));
		m = mult(m, translate(0.0, -1+headHeight, 2.0));
		figure[headId] = createNode( m, head, leftUpperArmId, null);
		m2 = translate(0.0, torsoHeight+0.5*headHeight, torsoHeight);
		m2 = mult(m2, rotate(theta2[head1Id], 1, 0, 0));
		m2 = mult(m2, rotate(theta2[head2Id], 0, 1, 0));
		m2 = mult(m2, translate(0.0, -1+headHeight, 2.0));
		figure2[headId] = createNode( m2, head, leftUpperArmId, null);
    break;

    case leftUpperArmId2:
		m = translate(-(torsoWidth/1.75), 0.5*torsoHeight, torsoHeight/2);
		m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
		m2 = translate(-(torsoWidth/1.75), 0.5*torsoHeight, torsoHeight/2);
		m2 = mult(m2, rotate(theta2[leftUpperArmId], 1, 0, 0));
		figure2[leftUpperArmId] = createNode( m2, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId2:
		m = translate(torsoWidth/1.75, 0.5*torsoHeight, torsoHeight/2);
		m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
		m2 = translate(torsoWidth/1.75, 0.5*torsoHeight, torsoHeight/2);
		m2 = mult(m2, rotate(theta2[rightUpperArmId], 1, 0, 0));
		figure2[rightUpperArmId] = createNode( m2, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId2:
		m = translate(-(torsoWidth/2.0), 0.5*torsoHeight, -torsoHeight/2);
		m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
		m2 = translate(-(torsoWidth/2.0), 0.5*torsoHeight, -torsoHeight/2);
		m2 = mult(m2 , rotate(theta2[leftUpperLegId], 1, 0, 0));
		figure2[leftUpperLegId] = createNode( m2, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId2:
		m = translate((torsoWidth/2.0)-0.2, 0.5*torsoHeight, -(torsoHeight/2)+0.5);
		m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );
		m2 = translate((torsoWidth/2.0)-0.2, 0.5*torsoHeight, -(torsoHeight/2)+0.5);
		m2 = mult(m2, rotate(theta2[rightUpperLegId], 1, 0, 0));
		figure2[rightUpperLegId] = createNode( m2, rightUpperLeg, tailId, rightLowerLegId );
    break;

    case leftLowerArmId2:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
		m2 = translate(0.0, upperArmHeight, 0.0);
		m2 = mult(m2, rotate(theta2[leftLowerArmId], 1, 0, 0));
		figure2[leftLowerArmId] = createNode( m2, leftLowerArm, null, null );
    break;

    case rightLowerArmId2:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
		m2 = translate(0.0, upperArmHeight, 0.0);
		m2 = mult(m2, rotate(theta2[rightLowerArmId], 1, 0, 0));
		figure2[rightLowerArmId] = createNode( m2, rightLowerArm, null, null );
    break;

    case leftLowerLegId2:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta2[leftLowerLegId], 1, 0, 0));
		figure2[leftLowerLegId] = createNode( m2, leftLowerLeg, null, null );
    break;

    case rightLowerLegId2:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta2[rightLowerLegId], 1, 0, 0));
		figure2[rightLowerLegId] = createNode( m2, rightLowerLeg, null, null );
    break;
	case tailId2:
		m = translate(0.0, 3, -2);
		m = mult(m, rotate(theta[tailId], 1, 0, 0 ));
		figure[tailId] = createNode( m, tail, null, null );
		m2 = translate(0.0, 3, -2);
		m2 = mult(m2, rotate(theta2[tailId], 1, 0, 0 ));
		figure2[tailId] = createNode( m2, tail, null, null );
    break;
	
    }
}



function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
   modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}
function traverse2(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure2[Id].transform);
   figure2[Id].render();
   if(figure2[Id].child != null) traverse2(figure2[Id].child);
   modelViewMatrix = stack.pop();
   if(figure2[Id].sibling != null) traverse2(figure2[Id].sibling);
}


function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5*torsoHeight-texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, rotateX(90));
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * headHeight+texasranger, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * upperArmHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * lowerArmHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * upperArmHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * lowerArmHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * upperLegHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( walker, 0.5 * lowerLegHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * upperLegHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, 0.5 * lowerLegHeight+texasranger, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(walker, -texasranger+1, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
	 
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    cube();

	nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

	
	document.getElementById("slider0").oninput = function(event) {
        theta[torsoId ] = event.target.value;
        initNodes(torsoId);
    };
	document.getElementById("slider1").oninput = function(event) {
        theta2[torsoId ] = event.target.value;
        initNodes(torsoId);
    };

	
	// Buttons here
	document.getElementById("Button1").onclick = function(){
		walk=!walk;
		if(walk==true){
			walkback=false;
		}
	};
	
	document.getElementById("Button2").onclick = function(){
		walkback=!walkback;
		if(walkback==true){
			walk=false;
		}
	};
	
	document.getElementById("Button3").onclick = function(){
		wag=!wag;
	};
	
	document.getElementById("Button4").onclick = function(){
		jump=!jump;
	};
	document.getElementById("Button5").onclick = function(){
		walk2=!walk2;
		if(walk2==true){
			walkback2=false;
		}
	};
	
	document.getElementById("Button6").onclick = function(){
		walkback2=!walkback2;
		if(walkback2==true){
			walk2=false;
		}
	};
	document.getElementById("Button7").onclick = function(){
		wag2=!wag2;
	};
	
	document.getElementById("Button8").onclick = function(){
		jump2 = !jump2;
	};
	document.getElementById("Button9").onclick = function(){
		walk=false;walk2=false;
		walkback=false;walkback2=false;
		wag=false;wag2=false;
		jump=false;jump2=false;
		theta[torsoId]=30;
		theta[leftUpperArmId]=180;
		theta[rightUpperArmId]=180;
		theta[leftUpperLegId]=180;
		theta[rightUpperLegId]=180;
		theta2[leftUpperArmId]=180;
		theta2[rightUpperArmId]=180;
		theta2[leftUpperLegId]=180;
		theta2[rightUpperLegId]=180;
		initNodes(torsoId);
		initNodes(rightUpperArmId);
		initNodes(leftUpperArmId);
		initNodes(rightUpperLegId);
		initNodes(leftUpperLegId);
		
	};
	
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);	
	
    for(i=0; i<numNodes; i++) {
		initNodes(i);
	}
	render();
}

var render = function() {
	
		if(wag==true){
			if(wagflag==false){
				theta[tailId]+=1.0;
				initNodes(tailId);
			}
			else{
				theta[tailId]-=1.0;
				initNodes(tailId);
			}
			if(theta[tailId]>=10){
				wagflag=true;
			}
			if(theta[tailId]<=0){
				wagflag=false;
			}
		
		}
		if(wag2==true){
			if(wagflag2==false){
				theta2[tailId]+=1.0;
				initNodes(tailId);
			}
			else{
				theta2[tailId]-=1.0;
				initNodes(tailId);
			}
			if(theta2[tailId]>=10){
				wagflag=true;
			}
			if(theta2[tailId]<=0){
				wagflag=false;
			}
		
		}
		
		if(walk==true){
			if(theta[torsoId]>=0){
				walker+=0.02;
			}
			if(walkflag==true){
				theta[leftUpperLegId] -=1.0;
				initNodes(leftUpperLegId);
				theta[leftUpperArmId] -= 1.0;
				initNodes(leftUpperArmId);
				
				theta[rightUpperLegId]+=1.0;
				initNodes(rightUpperLegId);
				theta[rightUpperArmId]+=1.0;
				initNodes(rightUpperArmId);
			}
			if(walkflag==false){
				theta[leftUpperLegId]+=1.0;
				initNodes(leftUpperLegId);
				theta[leftUpperArmId]+=1.0;
				initNodes(leftUpperArmId);
				
				theta[rightUpperLegId] -=1.0;
				initNodes(rightUpperLegId);
				theta[rightUpperArmId] -=1.0;
				initNodes(rightUpperArmId);
			}
			if(theta[leftUpperLegId]<=160){
				walkflag=false;
			}
			if(theta[rightUpperLegId]<=160){
				walkflag=true;
			}
		}

		if(walk2==true){
			if(theta2[torsoId]>=0){
				walker2-=0.02;
			}
			if(walkflag2==true){
				theta2[leftUpperLegId] -=1.0;
				initNodes(leftUpperLegId);
				theta2[leftUpperArmId] -= 1.0;
				initNodes(leftUpperArmId);
				
				theta2[rightUpperLegId]+=1.0;
				initNodes(rightUpperLegId);
				theta2[rightUpperArmId]+=1.0;
				initNodes(rightUpperArmId);
			}
			if(walkflag2==false){
				theta2[leftUpperLegId]+=1.0;
				initNodes(leftUpperLegId);
				theta2[leftUpperArmId]+=1.0;
				initNodes(leftUpperArmId);
				
				theta2[rightUpperLegId] -=1.0;
				initNodes(rightUpperLegId);
				theta2[rightUpperArmId] -=1.0;
				initNodes(rightUpperArmId);
			}
			if(theta2[leftUpperLegId]<=160){
				walkflag2=true;
			}
			if(theta2[rightUpperLegId]<=160){
				walkflag2=false;
			}
		}
		
		if(walkback==true){
			if(theta[torsoId]>=0){
				walker-=0.02;
			}
			if(walkbackflag==true){
				theta[leftUpperLegId] -=1.0;
				initNodes(leftUpperLegId);
				theta[leftUpperArmId] -= 1.0;
				initNodes(leftUpperArmId);
				
				theta[rightUpperLegId]+=1.0;
				initNodes(rightUpperLegId);
				theta[rightUpperArmId]+=1.0;
				initNodes(rightUpperArmId);
			}
			if(walkbackflag==false){
				theta[leftUpperLegId]+=1.0;
				initNodes(leftUpperLegId);
				theta[leftUpperArmId]+=1.0;
				initNodes(leftUpperArmId);
				
				theta[rightUpperLegId] -=1.0;
				initNodes(rightUpperLegId);
				theta[rightUpperArmId] -=1.0;
				initNodes(rightUpperArmId);
			}
			if(theta[rightUpperLegId]<=160){
				walkbackflag=true;
			}
			if(theta[leftUpperLegId]<=160){
				walkbackflag=false;
			}
		}
		
		if(walkback2==true){
			if(theta2[torsoId]>=0){
				walker2-=0.02;
			}
			if(walkbackflag2==true){
				theta2[leftUpperLegId] -=1.0;
				initNodes(leftUpperLegId);
				theta2[leftUpperArmId] -= 1.0;
				initNodes(leftUpperArmId);
				
				theta2[rightUpperLegId]+=1.0;
				initNodes(rightUpperLegId);
				theta2[rightUpperArmId]+=1.0;
				initNodes(rightUpperArmId);
			}
			if(walkbackflag2==false){
				theta2[leftUpperLegId]+=1.0;
				initNodes(leftUpperLegId);
				theta2[leftUpperArmId]+=1.0;
				initNodes(leftUpperArmId);
				
				theta2[rightUpperLegId] -=1.0;
				initNodes(rightUpperLegId);
				theta2[rightUpperArmId] -=1.0;
				initNodes(rightUpperArmId);
			}
			if(theta2[rightUpperLegId]<=160){
				walkbackflag=true;
			}
			if(theta2[leftUpperLegId]<=160){
				walkbackflag=false;
			}
		}
		
		if(jump==true){
			if(jumpflag==false){
				texasranger-=0.05;
			}
			else{
				texasranger+=0.05;
			}
			if(texasranger<=0){
				jumpflag=true;
			}
			if(texasranger>=.5){
				jumpflag=false;
			}
		}
		if(jump2==true){
			if(jumpflag2==false){
				texasranger2-=0.05;
			}
			else{
				texasranger2+=0.05;
			}
			if(texasranger2<=0){
				jumpflag2=true;
			}
			if(texasranger2>=.5){
				jumpflag2=false;
			}
		}
		
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		traverse(torsoId);
		traverse2(torsoId);
        requestAnimFrame(render);
}
