---
date: 2025-12-31
tags:
  - code
  - procedural
---

[참고한 링크](https://zalo.github.io/blog/kabsch/)
<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/s5nHoR-nBY8" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>

kabsch 알고리즘은 두 쌍의 점 집합 사이의 RMSD(제곱근)를 최소화하는 최적의 회전 행렬을 계산하는 방법이라고 한다. 

## from - to
처음, 이동하기 전 내가 갖고 있는 형태가 from, 그리고 기타 등등 외부와의 상호작용으로 인해 위치가 바뀐 상태가 to이다. 이동한 to의 상태에서 처음 내가 갖고 있던 상태로 돌려놓는(?) 최적의 행렬을 찾는다.

잠깐 "처음 위치로 돌아가기 위해 각각의 점을 얼마나 이동, 회전 시켜야하는가"로 오해했는데 회전하는 건 점의 집합 전체다. 유니티로 따지면 부모 - 자식(점들이 분포해 있음) 에서 부모가 회전한다. 

## 최적의 회전 행렬
이것을 알아내려면 최적의 이동과 회전을 알아내면 된다. 

이동은 평균 위치로 하면 되고, 회전은 고려할 게 더 많다. 

1. 위치를 평균 위치를 기준으로 새로 쓰기
2. 공분산 구하기 : 다른 점이 나로부터 얼마나 떨어져 있느냐를 구하는 건데 이걸 간단하게 하려고 중심을 평균위치로 옮겼다. 
3. 회전하기 

### 1. 위치를 평균 위치를 기준으로 새로 쓰기
평균 낸 위치에서 내 위치를 빼면 된다. 

### 2. 공분산 구하기 
[분산](https://m.blog.naver.com/khj90733/221892699481)은 편차(평균 - 나)의 제곱의 합이다. 분산은 값들이 평균과 얼마나 이질적이게 분포하는지 아닌지와 관련된 값이다. 

[공분산](https://blog.naver.com/sw4r/221025662499)은 Cov(X,Y)=∑(X편차​×Y편차​)로, 너의 편차와 나의 편차를 곱한 값의 합이다. 분산에서는 단순히 편차를 제곱한 값을 사용했는데 공분산은 너와 나의 편차를 곱함으로 너와 나의 변화와 관련된 값이 된다.

그런데 여기서는 공분산을 각 축이 얼마나 회전했냐를 구하기 위해서 사용한다... 일단 코드를 보자...
```
covariance = new Vector3[3]
```
우선 vector3를 3개를 선언한다. from으로부터 to가 x축은 x,y,z별로 얼마나 떨어져있는지를 구해야하기 때문이다. 

이미 1.에서 모든 점을 평균으로 위치시켜놨기 때문에 그냥 곱하면 된다.
```
for(i = 0; i < 3; i++) {
  for(j = 0; j < 3; j++) {
    for(k = 0; k < fromPoints.length; k++) {
      covariance[i][j] += 
        fromPoints[k][i] * toPoints[k][j];
    }
  }
}
```

Vector3에서 0은 x, y는 1, z는 2다. 그렇기에 Vector3[1]은 방향(x축)과 길이(float)를 둘다 갖고 있는 셈이다.

`fromPoints[k][i] * toPoints[k][j];` 를 하면 `i축의 방향 * 길이` + `j축의 방향 * 길이`가 된다.

위의 반복문을 돌다 보면 from의 x축과 to의 x축을 곱하게 되는 경우가 생기는데, 이 경우는 [내적을 구하는 식이 된다...](https://ko.wikipedia.org/wiki/공분산) 

[내적](https://m.blog.naver.com/ryumochyee-logarithm/221542210272)이란 간단히 말하면 정사영, 한 벡터가 다른 평면에 드리우는 그림자같은 거라고 생각할 수 있다.(!정사영은 벡터고 내적은 스칼라다)
내적의 공식은 |a||b|cosθ인데, 그렇기에 공분산을 구하면 cosθ를 알 수 있게 된다.

결과로 covariance에는 9개의 숫자가 나온다.
`[0, 10, 5](covariance[0])`

`[10, 1, 0](covariance[1])`

`[0, 0, 10](covariance[2])`
대각선에 있는 정보는 xx, yy, zz라서 회전해야할 각도(내적), 그리고 내적 이외의 값들은 회전해야하는 기준이 될 축에 대한 정보를 갖고 있다. 

내적으로 cosθ를 구했지만 이것만으로는 어느 축으로 얼마나 회전시켜야 하는지 알 수 없다.
### 3. 회전축을 구하고 회전시키기
이 코드 보고 i가 iteration의 약자구나 하는 생각이 문득 들었다. 
```
for (iter = 0; iter < iterations; iter++) {
  setBasesFromQuaternion(curQuaternion, 
                         curXBasis, curYBasis, curZBasis);
  omega = (cross(curXBasis, covariance[0]) +
           cross(curYBasis, covariance[1]) +
           cross(curZBasis, covariance[2])) / 
       abs(dot(curXBasis, covariance[0]) +
           dot(curYBasis, covariance[1]) +
           dot(curZBasis, covariance[2]) + 0.000000001);
  w = omega.magnitude;
  if (w < 0.000000001) break;
  curQuaternion = angleAxis(w, omega / w) * curQuaternion;
}
optimalRotation = curQuaternion;
```
setBasesFromQuaternion은 Vector4를 Vector3으로 바꿔주는 함수고, cross는 외적을 구하는 함수라고 한다.
사실 회전 값은 유니티 안에서 [vector4로 저장되는데](https://docs.unity3d.com/kr/2021.3/Manual/QuaternionAndEulerRotationsInUnity.html) 유니티가 보기 편하라고 내부적으로 오일러로 변환해서 인스펙터 창에서는 vector3으로 보여주는 거라고 한다... 헐 

화면 상에 보이는 물체(x,y)를 회전시키면 화면을 기준으로 회전한다.(z축) 이 z축을 구하는 방법이 외적이다. 

외적은 영어로 cross라고 불리는 건 계산할 때 (x1 y1 z1) (x2 y2 z2) 이렇게 있으면 (x1 * y2) - (x2 * y1) 이렇게 교차해 계산하기 때문이라고 한다. 
또, 교차시키는 이유는 이렇게 해야 왼쪽으로 돌리려는 힘과 오른쪽으로 돌리려는 힘을 계산해 알짜 돌림힘을 구할 수 있기 때문이다. 

축(외적)과 회전량(내적) 모두 구했지만 아직 회전시킬 수는 없다. 
외적은 |a||b|sinθ 인데, sin(30∘)과 sin(150∘)이 같아서 왼쪽으로 돌릴지 오른쪽으로 돌릴지 알 수 없기 때문이다.

그래서 외적/내적(sinθ / cosθ)을 해서 tanθ을 구하고, tan은 sin과 cos의 정보를 모두 가지게 되기 때문에, 어느 축으로 얼마나 회전해야하는지 알 수 있게 된다. 
이제 회전시키면 된다. 

## 정리
하나의 point cloud 안의 점이 이동하게 되었을 때 전체가 초기의 상태와 비슷해지게 전체를 회전시키는 방법. 

내적은 cos 외적은 sin 내적 이 두개를 알면 한 벡터를 다른 벡터에 일치하게끔 회전시킬 수 있음(`FromToRotation`함수의 원리)

kabsch는 모든 점에 대해 `FromToRotation` 한거라고 생각할 수 있을 듯?


