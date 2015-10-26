// // triangulation

////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document*/

var camera, scene, renderer;
var windowScale;
var sampleDiagonal


function init() {
	// Set up some parameters
	// For grading the window is fixed in size; here's general code:
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;
	// scene
	scene = new THREE.Scene();

	// Camera: Y up, X right, Z up
	windowScale = 50;
	var windowWidth = windowScale * canvasRatio;
	var windowHeight = windowScale;

	camera = new THREE.OrthographicCamera( windowWidth / - 2, windowWidth / 2,
		windowHeight / 2, windowHeight / - 2, 0, 40 );

	var focus = new THREE.Vector3( 15,15,0 );
	camera.position.x = focus.x;
	camera.position.y = focus.y;
	camera.position.z = 10;
	camera.lookAt(focus);

	renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	// renderer.setClearColorHex( 0xFFFFFF, 1.0 );

}
function showGrids() {
	// Background grid and axes. Grid step size is 1, axes cross at 0, 0
	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
	Coordinates.drawAxes({axisLength:20,axisOrientation:"x",axisRadius:0.02});
	Coordinates.drawAxes({axisLength:20,axisOrientation:"y",axisRadius:0.02});
}

function render() {
	renderer.render( scene, camera );
}

function PolygonGeometry(sides, location,radius) {
	var geo = new THREE.Geometry();

	// generate vertices
	for ( var pt = 0 ; pt < sides; pt++ )
	{
		// Add 90 degrees so we start at +Y axis, rotate counterclockwise around
		var angle = (Math.PI/2) + (pt / sides) * 2 * Math.PI;

		var x = Math.cos( angle )*radius+location.x;
		var y = Math.sin( angle )*radius+location.y;

		// Save the vertex location
		geo.vertices.push( new THREE.Vector3( x, y, 0.0 ) );
	}

	// generate faces
	for ( var face = 0 ; face < sides-2; face++ )
	{
		// this makes a triangle fan, from the first +Y point around
		geo.faces.push( new THREE.Face3( 0, face+1, face+2 ) );
	}
	// done: return it.
	return geo;
}
function createRectAngle(v1,v2){
	// var geometry=new THREE.BoxGeometry((Math.abs(v2.x)+Math.abs(v1.x)),((Math.abs(v2.y)+Math.abs(v1.y))),0);
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00,opacity:0.4, transparent:true} );
	var geometry=new THREE.Geometry();
	geometry.vertices.push(v1,v2,new THREE.Vector3(v1.x,v2.y,0),new THREE.Vector3(v2.x,v1.y,0));
	geometry.faces.push(new THREE.Face3(0,1,2));
	geometry.faces.push(new THREE.Face3(1,0,3));//order matters?
	var cube = new THREE.Mesh( geometry, material
	);
	// cube.position.x=cube.position.x+(v2.x-v1.x)/2;
	// cube.position.y=(v2.y-v1.y)/2;
	console.log("v1:"+v1.x+","+v1.y+"/\n v2:"+v2.x+" "+geometry.vertices[3].x+" "+geometry.vertices[3].y);
	scene.add( cube );
	
}
function fitToRectangle(geometry){
	//given a geometry, loop thruogh the vertices, find the rectangle geometry that contain the geometry
	//return partitioned coordinates. 
	// console.log(geometry.vertices.length);
	//FIND MINMAX
	var minX= Number.POSITIVE_INFINITY;
	var maxX= Number.NEGATIVE_INFINITY; 
	var minY= Number.POSITIVE_INFINITY;
	var maxY=Number.NEGATIVE_INFINITY;
	
	for(i=0;i<geometry.vertices.length;i++){
		var currentV=geometry.vertices[i];
		if (currentV.x<minX){
			minX=currentV.x;
		}
		if (currentV.x>maxX){
			maxX=currentV.x;
		}
		if (currentV.y>maxY){
			maxY=currentV.y;
		}
		if (currentV.y<minY){
			minY=currentV.y;
		}
	}
	//CREATE the rectangle
	createRectAngle(new THREE.Vector3(minX,minY,0),new THREE.Vector3(maxX,maxY,0));
	
	
}
// Main body of the script
	init();
	showGrids();
	var geo = PolygonGeometry(6, new THREE.Vector3( 3, 4, 0 ),10);
	var material = new THREE.MeshBasicMaterial( { color: "#ff0000", side: THREE.FrontSide } );
	var mesh = new THREE.Mesh( geo, material );
	scene.add( mesh );
	fitToRectangle(geo);
	document.body.appendChild( renderer.domElement );
	// addToDOM();
	render();

