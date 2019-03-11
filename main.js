var cubeRotation = 0.0;
var track1 =[];
var track2 =[];
var track3 =[];
var player;
var no_tracks = 30;
var no_walls = 100;
var wall1 = [];
var wall2 = [];
var coins = [];
var score=0;
var train=[];
var temp;
var gray_scale=true
var flash=false
var count=1;
var obs=[];
main();

function push_coins(gl,x,y,z){
  for(let i=0;i<5;i++){
    coins.push(new cube_w(gl, [x,y,z-9*i],0.7,0.7,0.01,'coin.jpg'));
  }
}
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  player = new Player(gl,[0.0,2.0,-2.0],0.38,0.38,0.38,'player.jpeg');
  boot =  new Player(gl,[0.0,2.0,-2.0],0.38,0.38,0.38,'player.jpeg');
  police = new cube_w(gl,[0.0,0.0,0.0],0.38,0.38,0.38,'police.jpeg');
  boot = new cube_w(gl,[-2,1.38,-30],0.38,0.38,0.38,'boot.jpeg');
  boost =  new cube_w(gl,[-2,1.38,-100],0.38,0.38,0.38,'boost.jpeg');
  police.show=true;
  player.boottime=0
  player.boostcount=0
  player.boost=false
  police.count=0;
  for(let i = 0; i<no_tracks;i++){
    track1.push(new cube_w(gl, [0.0,0.0,-3.0-20.0*i],1.0,1.0,10.0,'track.jpg'));
    track2.push(new cube_w(gl, [2.0,0.0,-3.0-20.0*i],1.0,1.0,10.0,'track.jpg'));
    track3.push(new cube_w(gl, [-2.0,0.0,-3.0-20.0*i],1.0,1.0,10.0,'track.jpg'));
  }
  push_coins(gl,2.0,1.7,-50.0);
  train.push(new cube_w(gl,[-2.0,2,-80.0],0.7,2,5.0,'fron.jpg'));
  train.push(new cube_w(gl,[2.0,2,-80.0],0.7,2,5.0,'fron.jpg'));
  train.push(new cube_w(gl,[2.0,2,-150.0],0.7,2,5.0,'fron.jpg'));
  push_coins(gl,0,7,-50);
  obs.push(new cube_w(gl,[0,1.1,-30],1.1,1.1,0.2,'obs.png'));
  obs.push(new cube_w(gl,[2,1.1,-30],1.1,1.1,0.2,'obs.png'));
  obs.push(new cube_w(gl,[0,1.1,-60],1.1,1.1,0.2,'obs.png'));
  for(let i = 0; i< no_walls;i++){
    wall1.push(new cube_w(gl, [4.0,0.0,-3.0-10.0*i],1.0,10.0,5.0,'wall.jpeg'));
    wall2.push(new cube_w(gl, [-4.0,0.0,-3.0-10.0*i],1.0,10.0,5.0,'wall.jpeg'));
  }

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program
  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`;
  // Fragment shader program

  const fsSource = `
  varying highp vec2 vTextureCoord;
  uniform sampler2D uSampler;
  void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  }
`;
const fsSource1 = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D u_texture;
    void main(void) {
      lowp vec4 Color = vec4(128.0/256.0,128.0/256.0,128.0/256.0,1.0);
      gl_FragColor =   Color * texture2D(u_texture, vTextureCoord);
    }
  `;
  const fsSource2 = `
  #ifdef GL_ES
  precision mediump float;
  #endif
   varying highp vec2 vTextureCoord;

   uniform sampler2D uSampler;

   void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(vec3(gray), 1.0);
  }
 `;
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgram1 = initShaderProgram(gl, vsSource, fsSource1);
  const shaderProgram2 = initShaderProgram(gl, vsSource, fsSource2);
  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
  const programInfo1 = {
    program: shaderProgram1,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram1, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram1, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram1, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram1, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram1, 'uSampler'),
    },
  };
  const programInfo2 = {
    program: shaderProgram2,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram2, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram2, 'uSampler'),
    },
  };
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    if(gray_scale){
      drawScene(gl, programInfo,programInfo1 ,deltaTime);
    }
    else{
      drawScene(gl,programInfo2, programInfo2,deltaTime);
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, program_Info,deltaTime) {
  player.tick()
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  
  // used to simulate the distortion of perspective in a camera.
  
  // Our field of view is 45 degrees, with a width/height
  
  // ratio that matches the display size of the canvas
  
  // and we only want to see objects between 0.1 units
  
  // and 100 units away from the camera.

  const fieldOfView = 60 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 1000.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [player.pos[0], 5, player.pos[2]+8.0]);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, [player.pos[0],5,player.pos[2]], up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    player.flag=1
for(let i=0;i<train.length;i++){
player_train(train[i],player);
}
if(police.show){
  police.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime,[player.pos[0],player.pos[1],player.pos[2]])
}
player_boot(boot,player)
boot.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime)
boost.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime)

for(let i=0;i<obs.length;i++){
  obs[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  player_obs(obs[i],player)
}

 player.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
 if(police.show){
  police.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime,[player.pos[0],player.pos[1],player.pos[2]+2]);
}
for(let i=0;i<coins.length;i++){
  coins[i].rotation+=0.1;
  coins[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
}
 //    temp.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(let i = 0; i<no_tracks ;i++){
      track1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      track2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      track3[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(let i = 0; i<train.length;i++){
      train[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    if(count==0 && flash){
    for(let i=0; i<no_walls;i++){
      wall1[i].drawCube(gl, viewProjectionMatrix, program_Info, deltaTime);
      wall2[i].drawCube(gl, viewProjectionMatrix, program_Info, deltaTime);
    }
  }
  else{
    for(let i=0; i<no_walls;i++){
      wall1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      wall2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
  }

player_boost(boost,player)
if(player.boost){
  player.pos[1]=6
  player.speed_y=0
  player.boostcount--;
  if(player.boostcount<0)
  player.boost=false
}
  for(let i=0;i<coins.length;i++){
if(coin_player(coins[i],player)){
coins.splice(i,1);
score+=10;
}
  }
    count=(count+1)%16;
if(police.show){
  police.count++;
}
if(police.count>100){
police.show=false
}
if(player.boottime>0)player.boottime--;
if(player.boottime==0)player.init_speedy=0.2

}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
function coin_player(coin,player){
if(Math.abs(coin.pos[2]-player.pos[2])<player.h+1.2 && Math.abs(coin.pos[1]-player.pos[1])<player.b+0.7 && Math.abs(coin.pos[0]-player.pos[0])<0.4 ){
  return true
}
return false
}
function player_train(tr,player){
  if(tr.pos[2]-tr.h<player.pos[2] &&  tr.pos[2]+tr.h>player.pos[2]&& Math.abs(tr.pos[0]-player.pos[0])<0.4){

      if(Math.abs(tr.pos[1]-player.pos[1])<tr.b+player.b){
          alert("Game Over "+ score)
      }
          else if(Math.abs(tr.pos[1]-player.pos[1])<tr.b+player.b+1 && player.speed_y<0){
              player.pos[1]=tr.pos[1]+tr.b+player.b
              player.speed_y=0
              player.flag=0
          }
          else{
          }

  }
  return 0;
}
function player_obs(tr,player){
  if(tr.pos[2]-tr.h<player.pos[2] &&  tr.pos[2]+tr.h>player.pos[2]&& Math.abs(tr.pos[0]-player.pos[0])<0.4 && tr.pos[1]-tr.b<player.pos[1] &&  tr.pos[1]+tr.b>player.pos[1]){
    if(police.show && police.count>3){
    alert("Game Over "+ score)
    }
    else{
      police.show=true
      police.count=0
    } 
  }

}
function player_boot(tr,player){
  if(tr.pos[2]-tr.h-player.h<player.pos[2] &&  tr.pos[2]+tr.h+player.h>player.pos[2] && Math.abs(tr.pos[0]-player.pos[0])<0.4 && tr.pos[1]-tr.b-player.b<player.pos[1] &&  tr.pos[1]+tr.b+player.b>player.pos[1]){
  player.boottime=400
  console.log("bootx")
  player.init_speedy=0.3
  }
}
function player_boost(tr,player){
  if(tr.pos[2]-tr.h-player.h<player.pos[2] &&  tr.pos[2]+tr.h+player.h>player.pos[2] && Math.abs(tr.pos[0]-player.pos[0])<0.4 && tr.pos[1]-tr.b-player.b<player.pos[1] &&  tr.pos[1]+tr.b+player.b>player.pos[1]){
  player.boost=true
  player.boostcount=400
  } 
}