---
date: 2026-01-08
tags:
  - code
  - graphics
---
[유니티 공식 문서](https://docs.unity3d.com/kr/530/Manual/SL-Shader.html)
## openGL vertex shader

```
#version 330 core


layout(location = 0) in vec3 positionOS;
layout(location = 1) in vec2 uv;
 

uniform mat4 uMVP;
uniform vec4 _BaseMap_ST;

out vec2 v_uv;

void main()
{
gl_Position = uMVP * vec4(positionOS, 1.0);
v_uv = uv * _BaseMap_ST.xy + _BaseMap_ST.zw;
}

```


[이전에 작성했던](/openGL-shader%2Ctexture) GLSL 코드에서 몇개 더 추가했다. 각각을 유니티의 HLSL에 대응시켜본다. 
### uniform - properties
gpu 전역 변수다.

```

TEXTURE2D(_BaseMap);
SAMPLER(sampler_BaseMap);
float4 _BaseMap_ST;
float4 _BaseColor;

```

### layout (in) - struct attributes
cpu에서 gpu로 넘어오는 데이터다.

```
struct Attributes
{
float4 positionOS : POSITION;
float2 uv : TEXCOORD0;
};

```

유니티에서는 attributes들을 struct안에 선언한다. 

뒤의 `POSITION`, `TEXCOORD0` 는 layout 뒤에 붙는 `(location = 1)` 과 같은 기능이라고 한다.

vec3 positionOS -> float4 positionOS : POSITION

vec2 uv -> float uv : TEXCOORD0

vec4 _ BaseMap_ ST -> float4 _ BaseMap_ ST

sampler2D tex0 - TEXTURE2D(_ BaseMap), SAMPLER(sampler_BaseMap) (sampler2D가 이 둘로 쪼개진다고 한다)

여기서 glsl uniform에서 하나 빠진 게 있는데, uMVP이다. hlsl에선 직접 선언하지 않고 vertex shader 안에서 `getVertexPositionInputs()` 이라는 함수로 받아온다고 한다.

### varying (out) - struct varyings
vertex shader에서 fragments shader으로 넘기는 데이터다.
```
struct Varyings
{
float4 positionHCS : SV_POSITION;
float2 uv : TEXCOORD0;
};

```

gl_Position -> float4 positionHCS : SV_POSITION

out vec2 v_uv -> float2 uv : TEXCOORD0

## HLSL의 구조

openGL에서 값을 gpu에 넘겨주는 번거로운 과정들을 다 생략한듯한 코드다. bind니 뭐니하는 부분이 다 빠졌다. 

```
Shader "이름" { 
Properties{} 
Subshaders{} 
[Fallback] 
[CustomEditor] }
```
fallback과 customEditor은 좀 더 고급 기능인 것 같아 보류하기로 하고 일단 properties와 subshader부터 보기로 한다. 

properties에는 전역 변수,

subshader에는 tags, 상태, pass,

pass안에는 이름, tags, struct(varying), CBUFFER, 쉐이더 본문이 들어간다. 

### properties
변수 이름 / 유니티 내 인스펙터 창에서 보여질 이름 / 포맷? 순으로 작성하는 것 같다.

숫자, 슬라이더 
```
name ("display name", Range (min, max)) = number name ("display name", Float) = number name ("display name", Int) = number
```

컬러, 벡터 
```
name ("display name", Color) = (number,number,number,number) name ("display name", Vector) = (number,number,number,number)
```

텍스처
```
name ("display name", 2D) = "defaulttexture" {}
name ("display name", Cube) = "defaulttexture" {}
name ("display name", 3D) = "defaulttexture" {}
```

### SubShader 
subshader 안에는 태그 / 상태 / 패스가 들어가고 패스 안에는 다시 이름과 태그가 들어간다. 

```
SubShader
{
Tags { "RenderType"="Opaque" "RenderPipeline"="UniversalPipeline" }
LOD 100

	Pass
	{
		Name "ForwardLit"
		Tags { "LightMode"="UniversalForward" }

		struct Attributes 
		struct Varyings

		CBUFFER_START() 
		CBUFFER_END
		
		Varying vert(Attributes input);
		half frag(Varings input) :SV_Target;
	}
}
```

vertex shader - fragment shader을 계산하는 1번의 과정을 패스라고 하는 것 같다. 쉐이더 하나 안에는 여러 개의 패스가 있을 수 있다. 그러니까 물체를 한 쉐이더로 두 번 그릴 수 있다는 거다.

아무튼 pass안에 위의 glsl- hlsl 을 바꾸면서 언급한 것들이 다 들어간다. CBUFFER에서는 전역변수 값 할당을 해주는 것 같다. `Varying vert(Attributes input); half frag(Varings input) :SV_Target`에 쉐이더 본문이 들어간다. 