var canvas = document.getElementById("webgl");
var color = [1, 1, 0.5, 1];

var ANGLE_STEP = 5.0; // The increments of rotation angle (degrees)
var rotateCylinderAngle = 0.0; // The rotation angle of joint1 (degrees)
var rotateCubeAngle = 0.0;

var cameraYaw = -20.0;
var cameraPitch = 0.0;
var lightpos = [3, 2, 0];

// modelview matrix declaration
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals
var viewProjMatrix = new Matrix4();
var matrixStack = [];
var move = 0.0;
var moveCube = 2.0;
var scaleCube = 1.0;
var moveAllX = 0.0;
var moveAllY = 5.0;
var raiseSphere = 0.0;
var intensity = 0.7;
var yaw = 0,
  pitch = 0,
  roll = 90;

function main() {
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
  // Initialize shaders
  var program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!program) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  if (!u_MvpMatrix || !u_NormalMatrix) {
    console.log("Failed to get the storage location");
    return;
  }

  //  handle color change
  document.getElementById("color").addEventListener("change", function (e) {
    changeColor(e);
  });

  //  handle intensity change
  document.getElementById("intensity").addEventListener("change", function (e) {
    intensity = e.target.value;
  });

  // Register the event handler to be called when keys are pressed
  document.onkeydown = function (ev) {
    keydown(ev);
  };

  drawScene(gl, program, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

// here we define the keydown event
function keydown(ev) {
  switch (ev.keyCode) {
    case 81: //q
      move += 1;
      break;
    // e
    case 69: //e
      move -= 1;
      break;

    case 85: //u
      lightpos[0] -= 1;
      break;

    case 73: //i
      lightpos[1] -= 1;
      break;

    case 79: //o
      lightpos[1] += 1;

      break;

    case 80: //p
      lightpos[0] += 1;
      break;

    case 74: //j
      lightpos[2] -= 1;
      break;
    // k
    case 75: //k
      lightpos[2] += 1;
      break;
    // wasd
    case 87: //w
      moveAllX -= 1;
      break;
    case 65: //a
      moveAllY += 1;
      break;
    case 83: //s
      moveAllX += 1;
      break;
    case 68: //d
      moveAllY -= 1;
      break;
    case 88: //x
      yaw += 1;
      break;
    case 67: //c
      yaw -= 1;
      break;

    case 86: //v
      pitch += 1;
      break;

    case 66: //b
      pitch -= 1;
      break;

    case 78: //n
      roll -= 10;
      break;

    case 77: //m
      roll += 10;
      console.log(roll);
      break;

    // R
    case 82:
      scaleCube += 0.1;
      break;

    // T
    case 84:
      scaleCube -= 0.1;
      break;

    // 1
    case 49:
      rotateCubeAngle += 0.1;
      break;

    // 2
    case 50:
      rotateCubeAngle -= 0.1;
      break;

    // 3
    case 51:
      rotateCylinderAngle += ANGLE_STEP;

      break;

    // 4
    case 52:
      rotateCylinderAngle -= ANGLE_STEP;
      break;
    default:
      return; // Skip drawing at no effective action
  }
}

function drawScene(gl, program, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // setting uniforms
  var u_LightDirection = gl.getUniformLocation(program, "u_LightDirection");
  gl.uniform3fv(u_LightDirection, new Float32Array(lightpos));

  var u_color = gl.getUniformLocation(program, "u_Color");
  gl.uniform4fv(u_color, color);
  gl.uniform1f(gl.getUniformLocation(program, "u_Intensity"), intensity);

  var u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
  gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);

  var camMatrix = new Matrix4();
  // camMatrix.rotate(pitch, 1, 0, 0);
  // camMatrix.rotate(roll, 0, 0, 1);

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.multiply(camMatrix);

  viewProjMatrix.setPerspective(
    100.0,
    canvas.width / canvas.height,
    0.1,
    1000.0
  );

  var centerX = 0.0;
  var centerY = 0.0;
  var centerZ = 0.0;

  var eyeX = 18.0;
  var eyeY = 3.0;
  var eyeZ = 12.0;
  var upX = 0.0;
  var upY = 1.0;
  var upZ = 0.0;
  var camX = 30 * Math.sin((yaw * Math.PI) / 180);
  var camY = 30 * Math.sin((pitch * Math.PI) / 180);

  var z1 = Math.cos((roll * Math.PI) / 180);
  var z2 = Math.sin((roll * Math.PI) / 180);

  viewProjMatrix.lookAt(eyeX, eyeY, eyeZ, -camX, -camY, centerZ, z1, z2, upZ);
  viewProjMatrix.multiply(camMatrix);

  /********** add light helper **********/
  var sphereBuffer = initSphereBuffers(gl);
  g_modelMatrix.setTranslate(lightpos[0], lightpos[1], lightpos[2]);
  g_modelMatrix.scale(0.2, 0.2, 0.2);

  addSphere(gl, sphereBuffer, program, u_MvpMatrix, viewProjMatrix, true);
  /**************************************/
  g_modelMatrix.setIdentity();
  /********** Custom object **********/

  var customBuffer = initCustomVertexBuffer(gl, teapot);
  if (customBuffer) {
    drawCustom(
      gl,
      customBuffer,
      program,
      viewProjMatrix,
      u_MvpMatrix,
      u_NormalMatrix
    );
  }
  /**************************************/

  var sphereBuffer = initSphereBuffers(gl);
  if (sphereBuffer) {
    if (sphereBuffer.indices.length < 0) {
      console.log("Failed to set the vertex information");
      return;
    }

    // draw another
    g_modelMatrix.setTranslate(2, 0, 0.0);
    g_modelMatrix.translate(moveAllX, 10.0, moveAllY);
    g_modelMatrix.scale(2.0, 2.0, 2.0);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    addSphere(
      gl,
      sphereBuffer,
      program,
      u_MvpMatrix,
      viewProjMatrix,
      u_NormalMatrix
    );
  }

  var cylinderBuffer = initCylinderBuffers(gl, 1, 5, 30, 10);
  if (cylinderBuffer) {
    if (cylinderBuffer.indices.length < 0) {
      console.log("Failed to set the vertex information");
      return;
    }

    g_modelMatrix.setTranslate(0, 0, 0);
    g_modelMatrix.translate(0.0, 0, move);

    // g_modelMatrix.scale(
    //   rotateCylinderAngle,
    //   rotateCylinderAngle,
    //   rotateCylinderAngle
    // ); // Make it a smaller cube

    g_modelMatrix.rotate(rotateCylinderAngle, 0, 1, 0);

    drawCylinder(
      gl,
      cylinderBuffer,
      program,
      viewProjMatrix,
      u_MvpMatrix,
      u_NormalMatrix
    );
  }

  var cubeBuffer = initVertexBuffers(gl);
  if (cubeBuffer) {
    if (cubeBuffer.indices.length < 0) {
      console.log("Failed to set the vertex information");
      return;
    }
    // g_modelMatrix.setTranslate(0, 0, 0);

    g_modelMatrix.rotate(-rotateCylinderAngle, 0, 1, 0);

    g_modelMatrix.translate(moveAllX, -1.0, moveAllY - move - moveCube);
    g_modelMatrix.rotate(rotateCubeAngle, 0, 1, 0);

    g_modelMatrix.scale(scaleCube, scaleCube, scaleCube);

    addBox(gl, cubeBuffer, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  }

  requestAnimationFrame(
    function () {
      // move += 0.1;
      drawScene(gl, program, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    } /*, canvas*/
  );
}

function addSphere(
  gl,
  sphereBuffer,
  program,
  u_MvpMatrix,
  viewProjMatrix,
  isLight = false
) {
  // gl.enableVertexAttribArray(program.a_Normal);
  g_mvpMatrix.set(viewProjMatrix);
  if (isLight) {
    g_mvpMatrix.set(viewProjMatrix);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBuffer.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphereBuffer.indices, gl.STATIC_DRAW);

  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.drawElements(
    gl.TRIANGLES,
    sphereBuffer.indices.length,
    gl.UNSIGNED_SHORT,
    0
  );
}

function addBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, n.indices.length, gl.UNSIGNED_BYTE, 0);
}

function drawCylinder(
  gl,
  cylinderBuffer,
  program,
  viewProjMatrix,
  u_MvpMatrix,
  u_NormalMatrix
) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBuffer.indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    cylinderBuffer.indices,
    gl.STATIC_DRAW
  );

  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(
    gl.TRIANGLES,
    cylinderBuffer.indices.length,
    gl.UNSIGNED_SHORT,
    0
  );
}

function drawCustom(
  gl,
  cylinderBuffer,
  program,
  viewProjMatrix,
  u_MvpMatrix,
  u_NormalMatrix
) {
  g_modelMatrix.setIdentity();
  g_modelMatrix.scale(0.2, 0.2, 0.2);
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

  gl.drawElements(gl.TRIANGLES, cylinderBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function hexToRgb(hexCode) {
  const r = parseInt(hexCode.substring(1, 3), 16);
  const g = parseInt(hexCode.substring(3, 5), 16);
  const b = parseInt(hexCode.substring(5, 7), 16);
  return [r, g, b];
}

function pushMatrix() {
  var copy = new Float32Array(16);
  copy.set(g_modelMatrix.elements);
  matrixStack.push(copy);
}

function popMatrix() {
  if (matrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  g_modelMatrix.elements = matrixStack.pop();
}

function changeColor(e) {
  var c = hexToRgb(e.target.value);
  var colorArray = c.map(function (item) {
    var val = parseInt(item) / 255;
    return val;
  });
  colorArray.push(1);
  color = colorArray;
}
