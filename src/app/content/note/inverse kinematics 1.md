---
date: 2025-12-21
tags:
  - code
  - IK
---
[깃허브 링크](https://github.com/nosignificant/procedural/tree/main/1.%20Basic)

<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/ZUSISBNPh1s" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
<p></p>

[이 유튜브](https://www.youtube.com/watch?v=abrJ3LXjLzA&t=211s) 영상을 참고해 내 거미를 만들어 보았다. 

위 영상은 
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

## 적용해보기

사실 위 코드에서 가장 어려운 부분은 리깅을 적용하는 거였다... 
<div classname="py-2 w-[250px]">

![](img/note/procedural/1.png)

</div>
전체 구조. 위 코드는 target과 constraint을 하나의 오브젝트에 넣어서 했는데 어떻게 한 건지 이해하지 못한 채로 따라하려다 엄청 시간을 버렸다. 
<div classname="py-2 w-[250px]">

![](img/note/procedural/2.png)

</div>
내가 만든 건 직접 움직이는 건 target, 그리고 그 위치를 따라가는 건 constraint다. 
constraint내부의 footL,R에는 유니티 내장 two bone IK constraint component를 붙여주고 이걸 묶은 부모에는 rig를 달아준다. 

<div classname="py-2 w-[250px]">

![](img/note/procedural/3.png)

</div>
직접 움직일 target - footL이다. 움직이라 명령하는 스크립트는 여기붙는다. 

<div classname="py-2 w-[250px]">

![](img/note/procedural/4.png)

</div>



skeleton에는 다리를 움직이게 만들 스크립트와 rig builder, 그리고 animator를 붙인다. 


```
IEnumerator moveForward(){
isMoving = true;

while (isMoving){
StartCoroutine(RotBody());

yield return StartCoroutine(MoveFoot(0));
//yield return new WaitWhile(() => isCentered);
yield return new WaitForSeconds(0.05f);
yield return StartCoroutine(MoveFoot(1));
yield return StartCoroutine(MoveBody());
}

isMoving = false;
}
```

1. 한쪽씩 발을 뻗는다.
2. 몸통을 발이 이동한 만큼 앞으로 가져간다.

몸은 발의 평균 위치로 이동시킨다.

```
IEnumerator MoveBody(){
//Vector3 dir = (transform.position - target.transform.position).normalized;
float x = foots[0].transform.position.x + foots[1].transform.position.x;
float z = foots[0].transform.position.z + foots[1].transform.position.z;
Vector3 startPos = this.transform.position;
Vector3 avgPos = new Vector3(x / 2, this.transform.position.y, z / 2);
//+ dir * stride;

float t = 0f;

while (t < 1f){
t += Time.fixedDeltaTime / moveDuration;
Vector3 currentPos = Vector3.Lerp(startPos, avgPos, t);
this.transform.position = currentPos;
yield return null;
}

this.transform.position = avgPos;
}
```
y축은 무시하고 했다.