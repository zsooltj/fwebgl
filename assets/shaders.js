var VSHADER_SOURCE = `attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  uniform vec3 u_LightDirection;
  uniform float u_Intensity;
  uniform vec4 u_Color;
  varying vec4 v_Color;
  varying vec3 v_LightDirection;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec4 color = u_Color;
    vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);
    v_LightDirection = normalize(mat3(u_NormalMatrix) * u_LightDirection);

    float nDotL = max(dot(normal, v_LightDirection), 0.0);
    v_Color = vec4(color.rgb * nDotL * u_Intensity + vec3(0.1), color.a);
  }`;

// basic Fragment shader program
var FSHADER_SOURCE = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }`;
