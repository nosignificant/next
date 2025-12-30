---
date: 2025-12-21
tags:
  - code
---
[깃허브 링크](https://github.com/nosignificant/procedural/tree/main/1.%20Basic)

<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/T6z_nVI19Ew" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>

1. 발이 땅에 닿아 있는지 확인 해야하고 
2. 땅에 닿아있으면 다음 발 디딜 곳을 찾아서 옮기고
3. 발이 간 만큼 몸도 따라가야하니까 몸을 발들의 평균위치, 각도로 보내고
	- 이 과정 전에 몸이 돌아가있으면 그 방향으로 발도 돌려야한다 

어떤 행동이 일어나고 있을 때는 다른 행동을 해서는 안 되고 다른 행동이 일어나지 않게 방지해줘야한다는 점에서  [멀티스레딩](https://ninaengineering.tistory.com/9) 생각이 났다. 

## 발이 땅에 닿아있는지 확인하기 
발이 땅에 닿아있는지 확인하려면 내 발의 위치에 [레이캐스트](https://docs.unity3d.com/550/Documentation/ScriptReference/Physics.Raycast.html)를 쏴서 거기에 콜라이더가 닿으면 된다.
내 발은 몸통에 달려있고, 몸통을 따라 움직여야 하기 때문에 발의 위치는 몸통을 기준으로 계산한다. 

1. 몸이 월드 상에서 얼마나 회전하려는지 확인한다.
```
float phi = Vector2.SignedAngle(new Vector2(moveDirection.x, moveDirection.z), Vector2.up);
```
2. 몸에 딸려 있는 발은 월드 상에서 얼마나 회전하려는지 확인한다.
3. 발이 회전한 각도와 몸과 발까지의 거리에 레이캐스트를 쏜다.
```
Vector3 raycastOrigin = 
root.transform.position  // 몸 위치
+ new Vector3(Mathf.Sin(psi), 100, Mathf.Cos(psi)) // 몸에서 발까지 각도
* magnitude; // 거리
```

## 발 디딜 곳 찾기 
마찬가지로 발디딜 곳의 좌표를 레이캐스트해서 있으면 발의 위치를 그곳으로 옮긴다. 
발 디딜 곳은 몸 방향 쪽으로 일정 거리만큼 전진시킨 곳의 좌표로 한다. 
```
Vector3 raycastOrigin = referencePosition + transform.forward * (offsetFoot ? stepStride / 2.0f : stepStride) + transform.up * 100;
```

## 몸 옮기기 
발을 이동시키고 나면 몸이 그 발에 따라가면 된다. 발의 평균 위치와 각도를 주면 된다. 

## 근데 발이 왜 제 위치에 돌아가야하지
그래서 그 코드들 빼고 복습 할 겸 새로 써봤다.

1. 앞으로 이동 명령이 있으면 발부터 뻗는다.
	이전 위치와 입력 받은restPosition() 이 다르면 발을 이동시킨다. 이걸 왼쪽 다리부터 한다
2. 발이 땅에 닿게 한다
3. 몸통을 발이 이동한 만큼 앞으로 가져간다.
4. 발이 다시 땅에 닿으면 stable position을 업데이트한다

예전에 vector, transform. position 얘네의 개념이 항상 헷갈렸는데 이거 하면서 정리가 많이 됐다 