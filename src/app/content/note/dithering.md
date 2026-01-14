---
date: 2026-01-14
tags:
  - code
  - graphics
---
디더링은 이미지를 표현할 때 의도적으로 잡음을 넣어 제한된 색으로 이미지를 자연스럽게 표현하는 방법이다. 내가 만들 디더링은 간단한 버전이지만 [return of the Obra Dinn](https://forums.tigsource.com/index.php?action=profile%3Bu%3D3073%3Bsa%3DshowPosts) 개발자 분의 블로그에 설명이 잘 되어있다. 

## vertex shader
화면에 보여질 색상을 결정하는 작업은 대부분 fragment shader에서 이루어지는 것 같다. vertex에서는 
- 정점 좌표 -> clip space 변환 -> 화면 상에서의 위치로 변환 
- 정점 별 노말 -> 월드 기준으로 바꾸기 
```
VertexPositionInputs vertexInput = GetVertexPositionInputs(input.position)

output.positionCS = vertexInput.positionCS;
```
컴퓨터 그래픽스 시간에 배웠던 행렬들을 계산하는 코드가 내장되어 있다.

관련 코드는 [여기](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl)보면 나온다... 
```
struct VertexPositionInputs
{
    float3 positionWS; // World space position
    float3 positionVS; // View space position
    float4 positionCS; // Homogeneous clip space position
    float4 positionNDC;// Homogeneous normalized device coordinates
};
```

```
VertexPositionInputs GetVertexPositionInputs(float3 positionOS)
{
    VertexPositionInputs input;
    input.positionWS = TransformObjectToWorld(positionOS);
    input.positionVS = TransformWorldToView(input.positionWS);
    input.positionCS = TransformWorldToHClip(input.positionWS);

    float4 ndc = input.positionCS * 0.5f;
    input.positionNDC.xy = float2(ndc.x, ndc.y * _ProjectionParams.x) + ndc.w;
    input.positionNDC.zw = input.positionCS.zw;

    return input;
}
```

```
float4 TransformWorldToHClip(float3 positionWS)
{
    return mul(GetWorldToHClipMatrix(), float4(positionWS, 1.0));
}
```
이런 식으로 코드가 전국각지에 흩어져 있다.

노말도 마찬가지 방법으로 `TransformObjectToWorldNormal` 해서 바꿔준다.

## fragment shader 
디더링은 지금 내가 계산할 화면 좌표의 밝기 - 텍셀에서 가져올 값(+@)을 비교해서 현재 fragment의 값을 결정한다. 
vertex에서 가져온 노말은 노말이 빛과 반대쪽을 보고있으면 0으로 clamp하는 용도로 쓴다. 