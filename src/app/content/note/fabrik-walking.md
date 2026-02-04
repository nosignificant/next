---
date: 2026-01-21
tags:
  - code
  - procedural
title: fabrik으로 걷는 발
---
## 시행착오

<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/zApEExzkIV4" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>

1. root를 몸통에 붙을 쪽, head를 땅에 붙을 쪽으로 만들려고 했는데 잘 안 됐다. 그래서 root는 fabrik 정렬이 안 되어 혼자 툭 튀어나와 있다.
2. 그런데 이렇게 (target과 붙어버린) root에서 head로 방향을 구하니까 이동할 방향이 잘 나와서 그냥 했다. 
3. 발이 Vector3.down으로 레이캐스트를 땅 아래쪽으로 쏴서 발이 땅에 붙어있는 게 기본인 상태고, 타겟과 몸이 멀어지면 "발을 떼는 동작"만 한다. 걷는 척하는 거다.
4. 몸 - 타겟이 멀어져서 발을 뻗어야하는 상태가 되면 
	- root - head (방향) 
	- 발걸음 거리 * 추가로 랜덤한 거리만큼 더 뻗음 
	이 두 개를 곱해서 위치를 지정한다.

![](img/note/procedural/Daddy_stuck.gif)


## 리팩토링 
발이 Vector3.down으로 아래쪽 땅만 확인했는데, 상하좌우도 확인할 수 있게 만들었다.  
1. 콜라이더에서 가장 가까운 표면을 찾는다. 
```
Collider[] colliders = Physics.OverlapSphere(targetPos, searchRadius, ground);
```
이 함수를 써서 근처에 있는 콜라이더를 가져온다. 
```
foreach (Collider col in colliders)
{
// ClosestPoint: 해당 콜라이더 표면 중 targetPos와 제일 가까운 점을 반환
	Vector3 point = col.ClosestPoint(targetPos);
	float dist = Vector3.Distance(targetPos, point);
	
		if (dist < minDistance)
		{
		minDistance = dist;
		bestPoint = point;
		}
	}
return bestPoint;
}
```
그리고 그 콜라이더 안에서 가장 가까운 점을 찾는다. 

2. `타겟 - 발`의 방향을 구하고, 그쪽으로 레이캐스트를 쏜다. 그리고 그곳에 있는 노말을 구한다. 
```
if (Physics.Raycast(rayOrigin, dirToSurface, out RaycastHit hit, 5.0f, ground))
	return hit.normal;
```
hit안에 normal이 있는 점이 신기하다. 