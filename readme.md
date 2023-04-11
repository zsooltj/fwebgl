Create a 3D multi-component object with at least three levels of hierarchy with hierarchically and independently transformable components; Set up a camera and light control mechanism
Use HTML or Javascript, please, no other language allowed.
Tasks

1. Your 3D scene needs to have at least one Cube, cylinder, and sphere.(cube, cylinder, and sphere should be hierarchically connected objects) You need also to import an additional triangular model that has a higher complexity. The model can be something created by others and downloaded online. Also, the model can be defined in any format, but using JSON is recommended. An example of how to read JSON geometry is in teapot.html of the WebGL TutorialLinks to an external site.

2) In addition, to transform your component, you should also be able to allow the object to roam as a whole around the space with the following control keys:
   W: move the object forward.
   S: move the object backward.
   A: move the object to the left
   D: move the object to the right
3) Allow the user to control the camera to look up/down (pitch), left/right (yaw), and clock/counterclockwise (roll) (https://en.wikipedia.org/wiki/Aircraft_principal_axesLinks to an external site.). Place your camera at a good location of your choice, and then use keystrokes P/p, Y/y, and R/r for the camera’s pitch, yaw, and roll control.
4) Add OpenGL (WebGL) lighting to illuminate your scene with GLSL shaders with one light source. Your VBOs should pass the vertex position, normals, and material properties (ambient, diffuse, and specular coefficients) as attributes to the shaders. Also, you must pass the lighting position, intensity/color, etc., as uniform variables to the shader. You will implement the per-fragment Phong shading algorithm involving vertex and fragment shaders.
5) Implement light control mechanism so that you can:
   Draw a sphere to show where your light is.
   Use keystrokes (define your own) to move the light around the scheme (i.e., modify X, Y, Z in world space)

1. Cube, cylinder, and sphere need to be hierarchically connected and can be independently transformed， if you don't know what hierarchical objects is, I can paste the intro here:
   and each object transformation( scale/rotate/transform of your choice, but needs to have three) needs to be controlled by different keyboard events, which key is up to you.
2. Triangular model you import outside doesn't count as the hierarchical object, you don't need to set separate movement.
   3.W/S/A/D needs to let all the objects on the scene move as a whole, including the triangular object.
3. Camera movement: look up/down, left/right, clock/counterclockwise are all keyboard listening events, they are not mouse control, and total 6 directions.
4. Do exactly what I told you in the text, no animation, no 360-degree control. etc.
5. It seems like there is not much misunderstanding on the lighting mechanism in requirements 4 and 5, requirement 5 has two parts, notice.
6. Only import third-party library that is used to create shader, or gl-matrix-min, no other imports allowed, and do not directly use main function-related code on websites, like github, thanks
