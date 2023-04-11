function initVertexBuffers(gl) {
  // Vertex coordinatesï¼ˆa cuboid 3.0 in width, 10.0 in heieght, and 3.0 in length with its origin at the center of its bottom)
  var vertices = new Float32Array([
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ]);

  const normals = new Float32Array([
    // Front face
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    // Back face
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

    // Top face
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

    // Bottom face
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

    // Right face
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Left face
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // right
    8,
    9,
    10,
    8,
    10,
    11, // up
    12,
    13,
    14,
    12,
    14,
    15, // left
    16,
    17,
    18,
    16,
    18,
    19, // down
    20,
    21,
    22,
    20,
    22,
    23, // back
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, "a_Position", vertices, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, "a_Normal", normals, gl.FLOAT, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return {
    normals: normals,
    positions: vertices,
    indices: indices,
    indexBuffer: indexBuffer,
  };
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log("Failed to get the storage location of " + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function initSphereBuffers(gl) {
  var SPHERE_DIV = 20;

  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;

  var positions = [];
  var indices = [];

  // Generate coordinates
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = (j * Math.PI) / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = (i * 2 * Math.PI) / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(si * sj); // X
      positions.push(cj); // Y
      positions.push(ci * sj); // Z
    }
  }

  // Generate indices
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV + 1) + i;
      p2 = p1 + (SPHERE_DIV + 1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }

  // Calculate normals
  var normals = [];
  for (i = 0; i < positions.length; i += 3) {
    var nx = positions[i];
    var ny = positions[i + 1];
    var nz = positions[i + 2];
    var length = Math.sqrt(nx * nx + ny * ny + nz * nz);

    normals.push(nx / length);
    normals.push(ny / length);
    normals.push(nz / length);
  }

  // Write the vertex property to buffers (coordinates and normals)
  if (
    !initArrayBuffer(gl, "a_Position", new Float32Array(positions), gl.FLOAT, 3)
  ) {
    return -1;
  }

  if (
    !initArrayBuffer(gl, "a_Normal", new Float32Array(normals), gl.FLOAT, 3)
  ) {
    return -1;
  }

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  //   position buffer is of type 'WebGLBuffer'.
  //   normals buffer is of type 'WebGLBuffer'.

  indices = new Uint16Array(indices);

  var normalbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  var positionbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //   type 'WebGLBuffer'.

  return {
    normal: normalbuffer,
    position: positionbuffer,
    indices: indices,
    indexBuffer: indexBuffer,
  };
}

function initCylinderBuffers(gl, radius, height, radialSubDiv, heightSubDiv) {
  var angleIncr = (2 * Math.PI) / radialSubDiv;

  var positions = [];
  var normals = [];
  var indices = [];

  for (var i = 0; i <= heightSubDiv; ++i) {
    var z = (i / heightSubDiv) * height;
    var ringRadius = radius * (1 - z / height);

    for (var j = 0; j <= radialSubDiv; ++j) {
      var angle = j * angleIncr;
      var x = ringRadius * Math.cos(angle);
      var y = ringRadius * Math.sin(angle);

      // position
      positions.push(x, y, z);

      // normal
      var nx = Math.cos(angle);
      var ny = Math.sin(angle);
      var nz = radius / height;
      var length = Math.sqrt(nx * nx + ny * ny + nz * nz);

      normals.push(nx / length, ny / length, nz / length);
    }
  }

  for (var i = 0; i < heightSubDiv; ++i) {
    for (var j = 0; j < radialSubDiv; ++j) {
      var first = i * (radialSubDiv + 1) + j;
      var second = first + radialSubDiv + 1;

      // triangle 1
      indices.push(first);
      indices.push(second);
      indices.push(first + 1);

      // triangle 2
      indices.push(first + 1);
      indices.push(second);
      indices.push(second + 1);
    }
  }

  // Write the vertex property to buffers (coordinates and normals)
  if (
    !initArrayBuffer(gl, "a_Position", new Float32Array(positions), gl.FLOAT, 3)
  ) {
    return -1;
  }

  if (
    !initArrayBuffer(gl, "a_Normal", new Float32Array(normals), gl.FLOAT, 3)
  ) {
    return -1;
  }

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  //   position buffer is of type 'WebGLBuffer'.
  //   normals buffer is of type 'WebGLBuffer'.

  indices = new Uint16Array(indices);

  var normalbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  var positionbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //   type 'WebGLBuffer'.

  return {
    normal: normalbuffer,
    position: positionbuffer,
    indices: indices,
    indexBuffer: indexBuffer,
  };
}

function initCustomVertexBuffer(gl, teapotData) {
  teapotVertexPositionBuffer = gl.createBuffer();
  teapotVertexPositionBuffer.itemSize = 3;
  teapotVertexPositionBuffer.numItems = teapotData.vertexPositions.length;

  teapotVertexNormalBuffer = gl.createBuffer();

  // Write the vertex property to buffers (coordinates and normals)
  if (
    !initArrayBuffer(
      gl,
      "a_Position",
      new Float32Array(teapotData.vertexPositions),
      gl.FLOAT,
      3
    )
  ) {
    return -1;
  }

  if (
    !initArrayBuffer(
      gl,
      "a_Normal",
      new Float32Array(teapotData.vertexNormals),
      gl.FLOAT,
      3
    )
  ) {
    return -1;
  }

  teapotVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(teapotData.indices),
    gl.STATIC_DRAW
  );

  return {
    normal: teapotVertexNormalBuffer,
    position: teapotVertexPositionBuffer,
    indices: teapotData.indices,
    indexBuffer: teapotVertexIndexBuffer,
    numItems: teapotData.vertexPositions.length,
    itemSize: 6,
  };
}
