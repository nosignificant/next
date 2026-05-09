---
date: 2026-04-30
tags:
  - code
  - graphics
title: openGL-shader,texture
---
## 전달받은 빛 정보를 fragment shader에서 사용하기 
- diffuse
```
float diffuse = max(dot(normal, lightDirection), 0.0f);
```
얼마나 같은 방향을 향하고 있느냐 - 같은 방향이면 1이 나오고 아니면 0에 가깝게 나오겠죠그걸로 전체 빛 세기 결정 

- [specular](https://novemberfirst.tistory.com/112)
	- 반사각 = 입사각 * (입사각과 노멀 내적 : 스칼라) * 노멀 방향 : 노멀방향으로 얼마나 방향을 갖고있는지 
		- n이 (0,1,0) 순수 Y축이라서 dot(P, n) = P의 Y성분만 뽑아내는 것과 같음(cos(θ) * |P|)
```
float specular = pow(max(dot(viewDirection, reflectionDirection), 0.0), shininess);
```
카메라 각도와 빛 반사 방향이 일치하면 강도 높고 아니면 낮음 

### specular 
```
FragColor = (texture(tex0, texCoord) * (diffuse + ambient) + texture(tex1, texCoord).r * specular) * lightColor;
```
텍스쳐의 흑백 정보를 specular 와 곱함

### point light 
```
float inten = 1.0f / (a * dist * dist + b * dist + 1.0f);
```
거리 멀수록 분모가 커져서 작아짐
	a: 거리에 따라 더 빠르게 감쇠
	b: 중간에 거리 감쇠 추가 

벡터는 원점에서 (a, b)까지 이동한거... 원점 - (a,b)까지가 방향, 이걸 피타고라스한게 스칼라
### spot light
```
float angle = dot(vec3(0.0f, -1.0f, 0.0f), -lightDirection);
```
- 입사각 - 위쪽 벡터 : 각 점과 원뿔 중심과의 거리
```
float inten = clamp((angle - outerCone) / (innerCone - outerCone), 0.0f, 1.0f);
```


## Mesh 
- 메쉬의 구성
	- 정점 정보(위치, 노멀, 색상, 텍스처) : VAO, VBO
	- 정점이 연결되는 정보 : EBO
	- 텍스쳐 : Texture
### class dependencies 

mesh
└  VAO - VBO : VAO는 정점에 대한 정보를 알려주는 것이므로 VBO에 대해 알아야함
└  EBO : EBO는 정점 재활용 정보이므로 이외의 다른 걸 알 필요가 없음 
└  Camera - Shader : 행렬 정보를 shader에 전달
└  Texture 🡥              : 텍스쳐 정보를 shader에 전달 

Mesh 클래스 내부: 
- 생성자에서 정점 정보를 초기화하고
- draw 함수에서 받아온 texture들을 하나씩 texUnit해주고 정점들을 그린다. 
### vector vs array
벡터는 배열의 길이를 몰라도 되는 동적 배열, 배열은 길이를 알아야하는 정적 배열
- size를 설정할 때는 `vertices.size(배열의 길이) * sizeof(Vertex)(vertex 자체의 크기)` 로 , 배열이 시작하는 첫번째 포인터는 `vertices.data()` 로 하면 된다. 

vec2/3/4와 동적 배열 vector이 혼용되고 있다... 

## Model 
모델링 데이터 파일이 모두 숫자로 이루어져 있기 때문에 이 숫자들을 어떻게 잘라서 어떻게 이름 붙일지 등에 관한, 숫자를 어떻게 가공할지에 대한 내용이다.
### glTF 구조 
scenes
  └ nodes
      └ meshes  → 실제 메시
          └ primitives  → 메시 조각
              ├ attributes : 버텍스
              └ indices
                  └ accessors : indices, attributes 정의
                      └ bufferViews
                          └ buffers  → 바이너리 데이터

model.cpp에서는 이 구조에 따라 숫자를 정점+인덱스로 조립하고, 이들을 모아 메시로 조립해서 하나의 모델링으로 만든다.

buffer를 float(1)과 GLuint(2)로 만들고, float을 다시 vec2, 3, 4로 만들고, 텍스쳐(3)를 불러오고, 이걸 용도에 따라 position, normal, texUV로 만들어 이걸 조립해서 vertices(4)를 만들고, vertices와 indices와 texture을 합해서 메시(5)를 만든다...

```
    "meshes" : [
        {
            "name" : "bunny",
            "primitives" : [
                {
                    "attributes" : {
                        "POSITION" : 0,
                        "NORMAL" : 1,
                        "TEXCOORD_0" : 2
                    },
                    "indices" : 3,
                    "material" : 0
                }
            ]
        }
    ],
```

accessor에서 나뉜 bufferView에 번호표를 주면(배열 상의 순서를 주면) primitives 안에서 이 번호는 attributes의 position입니다 / indices입니다 등등으로 정의해준다.

### 1. getFloats - accessor
```
    "accessors" : [
        {
            "bufferView" : 0,
            "componentType" : 5126,
            "count" : 208353,
            "max" : [ 숫자 ],
            "min" : [ 숫자 ],
            "type" : "VEC3"
        },
```

1. 이 accessor이 가리키는 bufferView 딕셔너리 자체와 이 bufferView를 시작할 지점인 accByteOffset을 찾아온다. 
2. bufferView에 적힌 byteOffset에 따라 숫자를 4개씩 묶어 float으로 변환시키고 이름(type)을 붙인다. 

bufferView 내부를 보면 버퍼 / 길이 / 오프셋만 존재하는데, 이 시작점을 accessor이 전달받으면 해당 구간의 float 갯수(type)를 정한다.

```
    "bufferViews" : [
        {
            "buffer" : 0,
            "byteLength" : 2500236,
            "byteOffset" : 숫자
        },
```

### 2. getIndices
여기서도 `getFloats`에서 했던 것과 비슷한 걸 하는데 index는 정수로 나타내야 하고, 항상 component type(unsigned int / unsigned short / short인지 결정)에 따라 4바이트씩 읽으면 안되기 때문에 함수가 분리됐다.
### 3. getTextures
텍스쳐가 여러 번 업로드 될 수 있기에 이를 방지하기 위해 loadTexName과 loadedTex를 사용한다.
이미 로드한 파일이면 loadedTex에 저장된 정보를 사용한다. 
### 4. assembleVertices
앞서 메쉬는 정점 정보는 위치, 노멀, 색상, 텍스쳐로 구성된다고 했는데, 이 함수에서는 색상은 무시했다.(모두 1.0f로 설정해두었다.)
### 5. loadMesh 
```
    "meshes" : [
        {
            "name" : "bunny",
            "primitives" : [
                {
                    "attributes" : {
                        "POSITION" : 0,
                        "NORMAL" : 1,
                        "TEXCOORD_0" : 2
                    },
                    "indices" : 3,
                    "material" : 0
                }
            ]
        }
    ],
```
primitives의 attributes와 indices에 각각 적힌 숫자는 accessor 배열의 몇번에 가야 해당 정보가 있는지에 관한 정보이다.
accessor의 0번에 가면 position에 관한 정보가, 1번에 가면 normal에 관한 정보가 있는 식이다. 그렇기 때문에 

```
unsigned int posAccInd = JSON["meshes"][indMesh]["primitives"][0]["attributes"]["POSITION"];
```
이를 통해 배열 위치를 알아내고 
```
std::vector<float> posVec = getFloats(JSON["accessors"][posAccInd]);
std::vector<glm::vec3> positions = groupFloatsVec3(posVec);
```
숫자 덩어리를 vec3 - position 정보로 변환시키면 된다. 

### traverseNode
메시간의 부모-자식 관계를 받아와서 행렬을 누적시키고 자식에게 넘겨준다.
glm과 gltf의 쿼터니언 순서가 다르기 때문에 gltf로 저장된 정보를 glm으로 맞춰서 변환해 저장한다. 