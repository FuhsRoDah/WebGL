"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 3;

var index = 0;

var pointsArray = [];
var normalsArray = [];

var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var diffuseProduct;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var diffuseProduct;
var program;
var pulse=false;
var R=true;
var G=false;
var B=false;
var SC=false;	//single color
var mushroom=false;
var solidr=false;	//boolean to pulse red
var solidg=false;	//boolean to pulse green
var solidb=false;	//boolean to pulse blue
var rclick=true;	//boolean for single color 
var gclick=false;	//boolean for single color
var bclick=false;	//boolean for single color
var mloop=false;	//boolean to make the mushroom pulse

function triangle(a, b, c) {

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

          // normals are vectors

     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);


     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var ambientProduct = mult(lightAmbient, materialAmbient);
     diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);


    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    document.getElementById("Button0").onclick = function(){lightPosition[1]+=0.1;};
    document.getElementById("Button1").onclick = function(){lightPosition[1]-=0.1;};
    document.getElementById("Button2").onclick = function(){lightPosition[0]-=0.1;};
    document.getElementById("Button3").onclick = function(){lightPosition[0]+=0.1;};
    document.getElementById("Button4").onclick = function(){
		pulse=!pulse;
		};
    document.getElementById("Button5").onclick = function(){
		R=!R;
		B=false;
		G=false;
		rclick=true;
		gclick=false;
		bclick=false;
	};
	document.getElementById("Button6").onclick = function(){
		G=!G;
		R=false;
		B=false;
		gclick=true;
		rclick=false;
		bclick=false;
	};
    document.getElementById("Button7").onclick = function(){
		B=!B;
		R=false;
		G=false;
		bclick=true;
		rclick=false;
		gclick=false;
	};
    document.getElementById("Button8").onclick = function(){
		SC=!SC;
		if(rclick==true){
			materialDiffuse[1]=0;
			materialDiffuse[2]=0;
		}
		if(gclick==true){
			materialDiffuse[0]=0;
			materialDiffuse[2]=0;
		}
		if(bclick==true){
			materialDiffuse[0]=0;
			materialDiffuse[1]=0;
		}
		
	};

    document.getElementById("Button9").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button10").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
	document.getElementById("Button11").onclick = function(){mushroom=!mushroom;};


    gl.uniform4fv( gl.getUniformLocation(program,"ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,"diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,"specularProduct"),flatten(specularProduct) );
    gl.uniform1f( gl.getUniformLocation(program,"shininess"),materialShininess );

    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniform4fv( gl.getUniformLocation(program,"lightPosition"),flatten(lightPosition) );
	gl.uniform4fv( gl.getUniformLocation(program,"diffuseProduct"),flatten(diffuseProduct) );
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

        normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];


    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    for( var i=0; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	
	//below is sloppy code that works
	if(pulse==true){
		if(R==true){
			if(solidr==false){
				if(materialDiffuse[0]<1){
					materialDiffuse[0]+=0.01;
				}
			}
			if(materialDiffuse[0]>=1)
				solidr=true;
		}
		if(G==true){
			if(solidg==false){
				if(materialDiffuse[1]<1){
					materialDiffuse[1]+=0.01;
				}
			}
			if(materialDiffuse[1]>=1)
				solidg=true;
		}
		if(B==true){
			if(solidb==false){
				if(materialDiffuse[2]<1){
					materialDiffuse[2]+=0.01;
				}
			}
			if(materialDiffuse[2]>=1)
				solidb=true;
		}
		if(solidr==true && R==true){
			materialDiffuse[0]-=0.01;
			if(materialDiffuse[0]<=0){
				solidr=false;
			}
		}
		if(solidg==true && G==true){
			materialDiffuse[1]-=0.01;
			if(materialDiffuse[1]<=0){
				solidg=false;
			}
		}
		if(solidb==true && B==true){
			materialDiffuse[2]-=0.01;
			if(materialDiffuse[2]<=0){
				solidb=false;
			}
		}
		
	}
	else if(pulse==false){
		materialDiffuse[0]=materialDiffuse[0];
		materialDiffuse[1]=materialDiffuse[1];
		materialDiffuse[2]=materialDiffuse[2];
	}
	if(mushroom==true){
		if(mloop==false){
			near+=0.02;far-=0.02;left+=0.02;right-=0.02;ytop-=0.02;bottom+=0.02;
			if(ytop<1){
				mloop=true;
			}
		}
		if(mloop==true){
			near-=0.02;far+=0.02;left-=0.02;right+=0.02;ytop+=0.02;bottom-=0.02;
			if(ytop>3){
				mloop=false;
			}
		}
	}
	else{
		mushroom=mushroom;
	}
	
    window.requestAnimFrame(render);
}
