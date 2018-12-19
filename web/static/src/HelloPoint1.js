// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;'+
  'attribute float a_PointSize;'+
  'void main() {\n' +
  '  gl_Position = a_Position;\n' + // Set the vertex coordinates of the point
  '  gl_PointSize = a_PointSize;\n' +                    // Set the point size
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');

  var a_position = gl.getAttribLocation(gl.program,'a_Position');
  if (a_position >=0) {
     gl.vertexAttrib4fv(a_position, new Float32Array([5.0, 0.0, 0.0, 10.0]));
  }else{
    console.error('not getAttribLocation');
  }

  if(a_PointSize >=0 ){
    gl.vertexAttrib1f(a_PointSize,30.0);
  }else{
   console.error('not size getAttribLocation'); 
  }


  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  canvas.onmousedown = function(event){
    click(event, gl, canvas, a_position);
  }
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
function click(ev, gl, canvas, a_position){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  console.error('click', x, y, rect.left, rect.top);
  x = (x - rect.left - canvas.height/2)/(canvas.height/2);
  y = (canvas.width/2-(y - rect.top))/(canvas.width/2);

  //g_points.push(x);
  //g_points.push(y);
  console.error('click', x, y, canvas.height, canvas.width);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //var len = g_points.length;
    if (a_position >=0) {
       gl.vertexAttrib3fv(a_position, new Float32Array([x, y, 0.0]));
    }else{
      console.error('not getAttribLocation');
    }
    gl.drawArrays(gl.POINTS, 0, 1);
  // for(var i=0; i<len; i += 2){

  // }
}
