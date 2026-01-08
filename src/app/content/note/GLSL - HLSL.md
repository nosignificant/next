---
date: 2026-01-08
tags:
  - code
  - graphics
---
[참고한 영상](https://www.youtube.com/watch?v=kNEn1I8Havg&list=PLZ8jYQexhCQgKqHcB4j-H6-8oOdBELJ58&index=11)
## vertex shader 
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

[이전에 작성했던](/openGL-triangle) GLSL 코드에서 몇개 더 추가했다. 각각을 유니티의 HLSL에 대응시키면 

### layout (in) - attributes 
cpu에서 gpu로 넘어오는 데이터다.
```
struct Attributes
{
float4 positionOS : POSITION; 
float2 uv : TEXCOORD0;
};
```
뒤의 `POSITION`, `TEXCOORD0` 는 layout 뒤에 붙는 `(location = 1)` 과 같은 기능이라고 한다.
vec3 positionOS - float4 positionOS : POSITION
vec2 uv - float uv : TEXCOORD0

### uniform - properties 
gpu 전역 변수다.
```
TEXTURE2D(_BaseMap);
SAMPLER(sampler_BaseMap);
float4 _BaseMap_ST;
float4 _BaseColor;
```
vec4 _ BaseMap_ ST - float4 _ BaseMap_ ST
sampler2D tex0 - TEXTURE2D(_ BaseMap), SAMPLER(sampler_BaseMap) (sampler2D가 이 둘로 쪼개진다고 한다)

여기서 glsl uniform에서 하나 빠진 게 있는데, uMVP이다. hlsl에선 직접 선언하지 않고 vertex shader 안에서 `getVertexPositionInputs()` 이라는 함수로 받아온다고 한다. 

### varying (out) - varyings output 
vertex shader에서 fragments shader으로 넘기는 데이터다.
```
struct Varyings
{
float4 positionHCS : SV_POSITION; 
float2 uv : TEXCOORD0;
};
```
gl_Position - float4 positionHCS : SV_POSITION
out vec2 v_uv - float2 uv : TEXCOORD0

### HLSL vertex shader 
```
Varyings vert(Attributes input)
{
Varyings output;

VertexPositionInputs vertexInput = GetVertexPositionInputs(input.positionOS.xyz);

output.positionHCS = vertexInput.positionCS;

output.uv = TRANSFORM_TEX(input.uv, _BaseMap);
return output;
}
```
gl_Position - output.positionHCS

## fragment shader 
```
#version 330 core

in vec2 v_uv;

uniform sampler2D _BaseMap; 
uniform vec4 _BaseColor;    

out vec4 fragColor;

void main()
{
    vec4 texColor = texture(_BaseMap, v_uv);
    fragColor = texColor * _BaseColor;
}
```

```
half4 frag(Varyings input) : SV_Target
{
half4 texColor = SAMPLE_TEXTURE2D(_BaseMap, sampler_BaseMap, input.uv);
return texColor * _BaseColor;
}
```

변수 선언은 위에 전부 해뒀으니 내용만 적으면 된다. 

