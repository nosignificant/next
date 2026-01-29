---
date: 2026-01-29
tags:
  - code
  - procedural
---

[참고한 곳 1](https://firefox214979.tistory.com/41)

[참고한 곳 2]([https://firefox214979.tistory.com/41](https://www.youtube.com/watch?v=_d8M3Y-hiUs))

<iframe 
  width="80%" 
  height="400" 
  src="https://youtube.com/embed/l2y5eohecYI" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>

새의 군집에서 따온 알고리즘이라고 한다. Boid 알고리즘이라고도 부른다. 

정렬/분리/응집할 방향을 계산한 후 전부 합쳐서 개별 단위가 이동해야할 방향을 결정한다.
```
Vector3 steeringForce = (alignment * alignmentWeight) + //정렬
                        (cohesion * cohesionWeight) + //응집
                        (separation * separationWeight) + //분리
                       (follow * boundaryWeight); //타겟을 따라가기

boid.velocity += steeringForce * Time.deltaTime;
```

## 정렬
주변에 있는 개체들이 향하고 있는 방향으로 가는 속도의 평균이다. 
```
foreach (Boid neighbor in neighbors)
  verageVelocity += neighbor.velocity;

averageVelocity /= neighbors.Count;
//현재 속도 + 필요한 힘 = 목표 속도이므로 , 필요한 힘을 구하려면 목표 속도 - 현재 속도
return (averageVelocity - boid.velocity).normalized;
```



## 분리 
거리가 일정 이상 가까워지면 밀어낸다. `목적지 - 나` 하면 목적지로 향하는 방향이 되고, `나 - 목적지` 를 하면 목적지에서 멀어지는 방향이 된다. 
```
foreach (Transform neighbor in neighbors)
{
float distance = Vector3.Distance(transform.position, neighbor.position);

if (distance < data.separationRadius)
	separation += (transform.position - neighbor.position) / distance;
}

return separation;
```
방향에 거리를 나누는 이유는 가까이 있으면 많이 밀고, 멀리 있으면 적게 멀기 위해서이다. 

거리를 제곱해서 위의 효과를 극대화할 수도 있다. 
```
separation += (transform.position - neighbor.position) / (distance * distance);
```

## 응집 
근처에 있는 이웃의 중심점을 구하고, 그쪽으로 이동하는 방향을 반환한다. 
```
foreach (Transform neighbor in neighbors)
	centerOfMass += neighbor.position;

centerOfMass /= neighbors.Count;

return (centerOfMass - transform.position);
```

중심점을 그냥 `위치의 합산 / 이웃의 수` 로 구할 수도 있지만, 가까울수록 더 큰 영향을 미치게끔 `1/거리` 를 곱해줄 수도 있다. 

```
 foreach (Transform neighbor in neighbors)
{
float distance = Vector3.Distance(transform.position, neighbor.position);

float weight = 1f / distance;
weightedCenter += neighbor.position * weight;
totalWeight += weight;
}

weightedCenter /= totalWeight;
```

이 세 가지를 더해서 `transform.forward`를 결정한다. 

이 알고리즘이랑 [kabsch](/kabsch) 알고리즘이랑 합치려고 했는데 막상 해보니 생각보다 드라마틱하게 움직이지 않아서 여기저기 많이 고쳐써야할 것 같다.