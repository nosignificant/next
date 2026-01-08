---
date: 2026-01-08
tags:
  - code
  - graphics
---
![](/img/note/code/openGL_3456.png)

## 3. index buffer
정점에 대한 정보 넘겨줌 

ebo를 만들어서 넘겨줌 (element buffer object)
vao에 저장된다고 하네요 

## 5. Shaders
vertexShader에 대한 내용이다.
```
#version 330 core

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;

out vec3 color;
uniform float scale;
void main()
{
//유니폼은 여기 선언하면 안 됨
gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
color = aColor;
}
```
여기에 작성된 내용이 어떻게 연결되고 컴파일되는지에 대해 이야기한다. 그러기 위해 우선 glVertexAttribPointer의 인자를 알아보고, 이후 uniform에 대해 이야기한다. 

### glVertexAttribPointer

이전 강에 VAO와 관련되어 언급된 [glVertexAttribPointer](https://wikis.khronos.org/opengl/GLAPI/glVertexAttribPointer)은 인자를 `(GLuint index​, GLint size​, GLenum type​, GLboolean normalized​, GLsizei stride​, const GLvoid * pointer​);` 이렇게 가진다. 

그리고 강의에서는 
```
void LinkAttrib(VBO& VBO, GLuint layout, GLuint numComponents, GLenum type, GLsizeiptr stride, void* offset){
glVertexAttribPointer(layout, numComponents, type, GL_FALSE, stride, offset);
glEnableVertexAttribArray(layout);
}
```

이렇게 정리했다. 

glVertexAttribPointer의 index는 LinkAttrib의 layout, size는 numComponents, stride는 stride에, pointer은 offset에 대응시켜서 이후의 글을 쓰기로 한다. 

openGL 2강에서 "[VAO](https://wikis.khronos.org/opengl/Vertex_Specification#Vertex_Array_Object)는 버텍스 데이터를 제공하는 데 필요한 상태를 저장한다" 고 했는데, 이 대응시킨 인자 하나씩 보면서 어떻게 상태를 저장하는지 확인해본다.

### layout 
layout은 openGL이 정점 값을 읽는 데에 도움을 준다.
```
#version 330 core

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;
```

vertex shader에서 레이아웃 0번에는 위치, 1번에는 색을 저장하기로 한다. 그러면 이 정보를 GPU로 넘겨줘야 한다. 이에 대한 정보를 넘겨주는 게 GLuint layout이다.  

### stride
![](/img/note/code/stride.png)
정점 속성 간의 거리를 의미한다. 

## offset 
속성이 저장되어 있는 곳까지의 거리를 의미한다. 위의 사진을 참고하면, 0바이트~ 11바이트까지는 위치 정보가 저장되어 있다. 그렇기 때문에 12바이트에서부터 읽어야한다고 알려줘야한다. 이 정보가 offset이다.  

정리하면 이렇게 된다. 
```
VAO1.LinkAttrib(VBO1, 0, 3, GL_FLOAT, 6 * sizeof(float), (void*)0);

VAO1.LinkAttrib(VBO1, 1, 3, GL_FLOAT, 6 * sizeof(float), (void*)(3 * sizeof(float)));
```

첫 줄은 위치 정보를 알려주는 코드다. layout은 0, 보폭은 float * 6 이고 시작점은 0이다. 

두번째 줄은 색상 정보를 알려준다. 보폭은 같고 layout은 1, 시작점을 float * 3이라고 알려준다. 

VBO에는 정점에 관한 정보 - 노말, 위치, 색상(?)이 저장됨을 알 수 있고, VAO에는 위에 작성한 정보 - layout, stride, offset 등이 저장됨을 알 수 있다.

### uniform
쉐이더에서 사용하는 글로벌 변수다. 어떤 쉐이더에서도 접근할 수 있다. 
관련 함수는 `GLuint glGetUniformLocation`, `void glUniform`이 있다. 

유니폼은 GLSL에서 전역 변수로 생성되어야 한다.
그렇기 때문에 cpu쪽에서 `glGetUniformLocation` 을 통해 어디에 생성되었는지 그 위치를 받아오고, 값을 cpu쪽에서 보낸다. 

## Texture 

STB라는 라이브러리를 다운받아 사용한다. 

1. stb를 이용해 이미지 데이터 생성 
2. 텍스처 버퍼 만들어서 설정들 만지기
3. 밉맵 설정
4. 유니폼으로 넘겨주기 
```
glTexImage2D(texType, 0, GL_RGBA, widthImg, heightImg, 0, format, pixelType, bytes);
```
최종적으로 gpu에 텍스처를 넘겨주는 코드다. 

### texture filtering 
텍스쳐가 크거나 작은 영역에 입혀질 때 어떻게 계산해서 집어넣을지에 관한 설정이다. 
```
glTexParameteri(texType, GL_TEXTURE_MIN_FILTER, GL_NEAREST_MIPMAP_LINEAR);
glTexParameteri(texType, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
```
linear은 텍스쳐 좌표에 이웃한 값을 이용해 보간, 이웃 값과의 근사치를 가져온다.
nearest는 텍스처 좌표에 가장 가까운 픽셀을 선택한다.

텍스쳐가 커지게 될 때와 작아지게 될 때 두 가지 경우 모두 설정해준다. 

### texture wrapping 
텍스처의 좌표는 일반적으로 0~1인데, 이 밖의 좌표를 채우기 위한 설정이다. 
```
glTexParameteri(texType, GL_TEXTURE_WRAP_S, GL_REPEAT);
glTexParameteri(texType, GL_TEXTURE_WRAP_T, GL_REPEAT);
```
GL_REPEAT : 반복

GL_MIRROR_REPEAT: 반복할때마다 뒤집음 

GL_CLAMP_TO_EDGE: 이미지의 가장자리가 각각 0, 1까지 늘어남

GL_CLAMP_TO_BORDER : 이미지 밖은 사용자 지정 색으로 채워짐 

이미지 좌표 s(x), t(y) 를 각각 적용해줘야 한다.

### mipmap 
```
glGenerateMipmap(texType);
```
시야에서 멀어져 물체가 작아졌을 때와 물체가 크게 보일 때 적용되는 텍스처가 같을 필요는 없다. 고해상도 이미지를 작은 물체에 사용하는 것은 메모리 낭비일 것이다. 이런 이유로 크기 별로 적용할 텍스처를 만들어두는 것이 mipmap이다. 