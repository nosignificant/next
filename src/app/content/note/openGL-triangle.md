---
date: 2026-01-05
tags:
  - code
  - graphics
---
https://learnopengl.com/Getting-started/Hello-Triangle

## 윈도우 켜기, back&front buffer

`glfwInit();`으로 시작한다.

컴퓨터 화면은 back buffer과 front buffer을 만들고 front buffer을 다 그리면 back buffer을 불러와서 그린다.

1. `GLFWwindow* window` : 윈도우 불러오기. 모든 openGL 객체는 레퍼런스로 접근해야 한다는데...?
2. `glfwMakeContextCurrent(window)` : 한 스레드만 현재 상태로 등록될 수 있고 그걸 등록하는 함수.
3. `glClear(GL_COLOR_BUFFER_BIT)` : back 버퍼를 지우고 새로 그린다.
4. `glfwSwapBuffers(window)` : back buffer과 front 버퍼를 바꾼다.
5. `while(!glfwWindowShouldClose(window) glfwPollEvents()` : 이걸 등록해야 윈도우 리사이즈나 키보드, 마우스 입력 등을 처리할 수 있다.

3, 4를 반복하고 `glfwTerminate();`으로 닫는다.

## 삼각형 그리기

openGL이 화면을 그리는 방법은 정점 데이터를 받아온다 - 정점 이동 및 연결해 그림 - 래스터화 - fragment로 색상 입힘 - 화면을 벗어난 fragment들을 지우고 보간하는 등의 작업 순이다.

그렇기에 첫번째로 정점을 그리는 방법을 알아야한다.

정점을 그리려면 쉐이더를 만들고 정점에 대한 데이터를 GPU로 넘겨줘야 한다.

또 정점에 대한 정보를 알려주려면 VAO와 VBO를 만들고 , 각각을 현재 상태로 등록해준 뒤 데이터를 GPU로 넘겨줘야 한다.

## vertex shader
```
GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
glCompileShader(vertexShader);
```

GLuint는 그냥 unsigned int인데 여기에 shader의 레퍼런스를 할당한다. 
[glShaderSource](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glShaderSource.xhtml)로 gpu쪽에 소스를 전송하고 컴파일한다. 

### shader program 
```
GLuint shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);
```
여러 개의 쉐이더를 묶어서 보낸다. 

## VBO, VAO 
VBO는 vertex buffer object, VAO는 vertex array object이다. 
buffer은 데이터가 한 곳에서 다른 곳으로 전송되는 동안 일시적으로 데이터를 저장하는 영역이라고 한다. 문화어로 완충 기억기라는데 병목 현상 완화를 위해 사용된다고 한다. 인터넷이나 컴퓨터 게임을 하면 자주 만나는 버퍼링의 어원이 버퍼일 것이다. 

뜻을 종합하면 VBO는 정점에 대한 데이터를 모아두는 오브젝트가 된다. VBO에는 위치, 노말, 색상등에 대한 정보가 들어있는 오브젝트다. 
[VAO](https://wikis.khronos.org/opengl/Vertex_Specification#Vertex_Array_Object)는 버텍스 데이터를 제공하는 데 필요한 상태를 저장한다. 
VBO를 만들기 전에 VAO를 만들어야 한다.

### binding
```
    GLuint VBO, VAO;
    //각각 1개의 오브젝트를 만든다 
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);

    glBindVertexArray(VAO);

    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    //VBO에 대한 정보를 넘겨줌 
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    //0번 배열 
    glEnableVertexAttribArray(0);

    //해제
    glBindBuffer(GL_ARRAY_BUFFER, 0); 
    glBindVertexArray(0); 
```
특정한 오브젝트를 현재 사용하는 상태로 만들기. 어떤 것을 수정하면 현재 상태로 등록되어 있는 오브젝트를 수정한다. 
glBufferData(데이터 종류, 크기, 실제 데이터, 상태)
상태의 종류

static: 한 번 수정되고 여러번 사용될 것

dynamic: 여러 번 수정되고 여러번 사용될 것

stream: 한 번만 수정되고 자주 사용되지 않을 것

이후 while(!glfwWindowShouldClose(window)) 루프 안에서 

`glUseProgram(프로그램 이름), `

`glBindVertexArray(VAO), `

`glDrawArrays(GL_TRIANGLES, 0, 3);`
해서  삼각형을 그리면 된다.
