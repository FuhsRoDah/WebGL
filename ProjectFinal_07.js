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
var materialAmbient = vec4( 0.0, 0.1995, 1, 1.0 );
var materialDiffuse = vec4( 0.0, 0.60648, 1, 1.0);
var materialSpecular = vec4( 0.0, 0.555802, 1, 1.0 );
var materialShininess = 10.0;

var ambientProduct;
var diffuseProduct;
var specularProduct;

var materialAmbient2 = vec4( 1, 0.2, 0.2, 1.0 );
var materialDiffuse2 = vec4( 1, 0.2, 0.2, 1.0);
var materialSpecular2 = vec4( 1, 0.2, 0.2, 1.0 );

var ambientProduct2;
var diffuseProduct2;
var specularProduct2;

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
var torsoId2 = 11;

var wide=0;

var torsoHeight = 5.0;
var torsoWidth  = 2.0;
var upperArmHeight = 2.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.7;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.7;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth  = 1.0;

var numNodes = 12;
var numAngles = 12;

var theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 30];
var theta1 = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 30];
var theta2 = [-30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 30];
var thetatemp=[-30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 30]

var stack = [];
var figure = [];
var position;
var pos1=-5;
var pos2=5;

var armup=false;
var armupflag=false;
var armdown=false;
var armdownflag=false;
var comehere=false;
var comehereflag=false;
var goback=false;
var gobackflag=false;

var up;
var up1=0;
var up2=0;


var jump=false;
var jumpflag=false;
var sit=false;
var walk = false;
var walkflag=false;
var walkback=false;
var walkbackflag=false;


for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

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

    switch(Id) {

    case torsoId:
		m = translate(position, 0, 0);
		m = mult(m,rotate(theta[torsoId], 0, 1, 0 ));
		figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:
		m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
		m = mult(m, rotate(theta[head1Id], 1, 0, 0))
		m = mult(m, rotate(theta[head2Id], 0, 1, 0));
		m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
		figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;

    case leftUpperArmId:
		m = translate(-(torsoWidth/1.75), 0.95*torsoHeight, 0.0);
		m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:
		m = translate(torsoWidth/1.75, 0.95*torsoHeight, 0.0);
		m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:
		m = translate(-(torsoWidth/2.0), 0.1*upperLegHeight, 0.0);
		m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
		m = translate(torsoWidth/2.0, 0.1*upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
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

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5*torsoHeight-up, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5 * headHeight+up, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight+up, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
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
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

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
		armup=!armup;
		if(armup){
			armdown=false;
		}
	};
	
	document.getElementById("Button2").onclick = function(){
		armdown=!armdown;
		if(armdown){
			armup=false;
		}
		
	};
	
	document.getElementById("Button3").onclick = function(){
		comehere=!comehere;
	};
	
	document.getElementById("Button4").onclick = function(){
		goback=!goback;
		if(goback){
			armdown=true;
		}
		else{
			armdown=false;
		}
	};
	
	document.getElementById("Button5").onclick = function(){
		jump=!jump;
	};
	
	document.getElementById("Button6").onclick = function(){
		sit=!sit;
		if(sit){
			
			walk=false;
			walkback=false;
		}
	};
	
	document.getElementById("Button7").onclick = function(){
		walk=!walk;
		if(walk){
			walkback=false;
		}
	};
	
	document.getElementById("Button8").onclick = function(){
		walkback=!walkback;
		if(walkback){
			walk=false;
		}
	};

	

    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);	
	
    for(i=0; i<numNodes; i++) initNodes(i);

	render();
}

var render = function() {
		
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		ambientProduct = mult(lightAmbient, materialAmbient);
		diffuseProduct = mult(lightDiffuse, materialDiffuse);
		specularProduct = mult(lightSpecular, materialSpecular);
		gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
		gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
		gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
		
		

		theta = theta2;
		
		if(walkback==true){
			if(theta[torsoId]<=0){
				pos2+=0.02;
			}
			if(walkbackflag==true){
				theta2[leftUpperLegId]-=1.0;
				initNodes(leftUpperLegId);
				
				theta2[rightUpperLegId]+=1.0;
				initNodes(rightUpperLegId);
			}
			if(walkbackflag==false){
				theta2[leftUpperLegId]+=1.0;
				initNodes(leftUpperLegId);
				
				theta2[rightUpperLegId]-=1.0;
				initNodes(rightUpperLegId);
			}
			if(theta2[leftUpperLegId]<=185){
				walkbackflag=false;
			}
			if(theta2[leftUpperLegId]>=220){
				walkbackflag=true;
			}
		}
		
		if(walk==true){
			if(theta[torsoId]<=0){
				pos2-=0.02;
			}
			if(walkflag==false){
				theta2[leftUpperLegId]+=1.0;
				initNodes(leftUpperLegId);
				
				theta2[rightUpperLegId]-=1.0;
				initNodes(rightUpperLegId);
			}
			if(walkflag==true){
				theta2[leftUpperLegId]-=1.0;
				initNodes(leftUpperLegId);
				
				theta2[rightUpperLegId]+=1.0;
				initNodes(rightUpperLegId);
			}
			if(theta2[leftUpperLegId]<=185){
				walkflag=false;
			}
			if(theta2[leftUpperLegId]>=220){
				walkflag=true;
			}
		}
		console.log(theta[leftUpperLegId]);
		console.log(walkflag);
		if(sit==true){
			if(theta2[leftUpperLegId]>=90){
					theta2[leftUpperLegId]-=3;
					initNodes(leftUpperLegId);
					theta2[rightUpperLegId]-=3;
					initNodes(rightUpperLegId);
			}
		}
		else{
			if(theta2[leftUpperLegId]<=180){
				theta2[leftUpperLegId]+=3;
				initNodes(leftUpperLegId);
				theta2[rightUpperLegId]+=3;
				initNodes(rightUpperLegId);
			}
		}
		
		
		if(jump==true){
			if(jumpflag==false){
				up1-=0.2;
			}
			else{
				up1+=0.2;
			}
			if(up1<=-1){
				jumpflag=true;
			}
			if(up1>=0){
				jumpflag=false;
			}
		}
		else{
			up1=0;
		}
		
		up=up2;
		position = pos2;
		traverse(torsoId);
		initNodes(torsoId);
		theta2 = thetatemp;
		
		
		ambientProduct2 = mult(lightAmbient, materialAmbient2);
		diffuseProduct2 = mult(lightDiffuse, materialDiffuse2);
		specularProduct2 = mult(lightSpecular, materialSpecular2);
		gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct2));
		gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct2));
		gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct2));
		
		theta = theta1;

		if(goback==true){
			if(gobackflag==false){
				theta1[leftLowerArmId]+=3;
				initNodes(leftLowerArmId);
			}
			if(gobackflag==true){
				theta1[leftLowerArmId]-=3;
				initNodes(leftLowerArmId);
			}
			if(theta1[leftLowerArmId]<=0){
					gobackflag=false;
			}
			if(theta1[leftLowerArmId]>=20){
					gobackflag=true;
			}
		}
		else{
			if(theta1[leftLowerArmId]<=0){
				theta1[leftLowerArmId]+=3;
				initNodes(leftLowerArmId);
			}
		}
		
		if(comehere==true){
			if(comehereflag==false){
				theta1[rightLowerArmId]-=3.0;
				initNodes(rightLowerArmId);
			}
			else{
				theta1[rightLowerArmId]+=3.0;
				initNodes(rightLowerArmId);
			}
			if(theta1[rightLowerArmId]>=0){
				comehereflag=false;
			}
			if(theta1[rightLowerArmId]<=-90){
				comehereflag=true;
			}
		}
		else{
			if(theta1[rightLowerArmId]<=0){
				theta1[rightLowerArmId]+=3;
				initNodes(rightLowerArmId);
			}
		}
		
		if(armup==true){
			if(armupflag==false){
				theta1[rightUpperArmId]-=3;
				initNodes(rightUpperArmId);
			}
			if(armupflag==true){
				theta1[rightUpperArmId]=theta1[rightUpperArmId];
				initNodes(rightUpperArmId);
			}
			if(theta1[rightUpperArmId]<=20){
					armupflag=true;
			}
			if(theta1[rightUpperArmId]>=180){
					armupflag=false;
			}
		}
		else{
			if(theta1[rightUpperArmId]<=180){
				theta1[rightUpperArmId]+=3;
				initNodes(rightUpperArmId);
			}
		}
		
		if(armdown==true){
			if(armdownflag==false){
				theta[leftUpperArmId]-=3;
				initNodes(leftUpperArmId);
			}
			if(armdownflag==true){
				theta[leftUpperArmId]=theta1[leftUpperArmId];
				initNodes(leftUpperArmId);
			}
			if(theta[leftUpperArmId]<=160){
					armdownflag=true;
			}
			if(theta[leftUpperArmId]>=180){
					armdownflag=false;
			}
		}
		else{
			if(theta[leftUpperArmId]<=180){
				theta[leftUpperArmId]+=3;
				initNodes(leftUpperArmId);
			}
		}
		up=up1;
		position=pos1;
		traverse(torsoId);
		initNodes(torsoId);
		theta1 = theta;
		/*
		I ran into a lot of problems when I was making this final project.
		For example, the person 1 buttons are only supposed to effect person 1,
		and person 2 buttons are only supposed to work on person 2.
		I could not figure these problems out even though I know that the problem most likely lies
		in the thetas, so this is how it turned out.
		The arm up goes back to normal when clicking it again and the same is true for the rest of the buttons except
		for the walks.
		Other than the people copying eachother, the buttons all work. person1's button 1 corresponds to person2's 
		button 1 and so on.
		*/
		
		
        requestAnimFrame(render);
}
