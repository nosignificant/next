---
date: 2026-01-29
tags:
  - code
  - procedural
---

![](img/note/procedural/CCDIK_p.png)

ccdik 활용하면 이런 관절을 만들 수 있을 것 같아서 도전했다.


## 시행착오


<div classname="py-2 w-[250px]">

![](img/note/procedural/CCDIK_p1.png)

</div>

<div classname="py-2">

<iframe 
  width="80%" 
  height="400" 
  src="https://youtube.com/embed/i7can5TpDV0" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
</div>
되긴 했는데 구조가 너무 복잡하다...

<div classname="py-2"></div>

그래서 그냥 타겟1 - 타겟2 해서 나온 방향으로 바라보는 코드로 한번 고쳐봤는데 오히려 더 복잡해졌다. 부모의 회전 상태까지 고려를 해야해서 부모의 회전 상태를 무조건 xyz 000으로 맞춰야하는 게 어려운 점이었다. 인스펙터 창에 들어가서 확인하지 않으면 알 수 없는 정보이기 때문이다. 
```
    void TargetRotate()
    {
        Vector3 rotDir = target1.position - target2.position;
        Quaternion targetRotation = Quaternion.LookRotation(rotDir);
        transform.position = target1.position;
        transform.rotation = targetRotation;
    }
```

![](img/note/procedural/CCDIK_p2.png)

<div classname="py-2"></div>

또 기타 자잘한 시행착오들을 적어보자면 
1. 몸을 발들의 평균 위치로 이동시키려고 했는데, 발은 땅에 붙어있기 때문에 몸통이 계속 아래로 꺼진다. 이전에 가장 처음 ik를 만들었을 때 y축을 무시했던 이유가 이것 때문이었다. 
이를 방지하기 위해서는 위쪽으로 떠있게 `new Vector(0,5,0)`줬는데, 이러면 y축이 고정되어 버렸다. 그래서 높이를 어떻게 유동적으로 할 수 있을지 고민했다. 
2. 다리가 움직이고 몸이 따라가는 식으로 하려고 유니티 hierachy상에서 몸통과 다리를 분리해뒀었다. 이러니까 도통 같이 움직이게 할 방법을 찾을 수가 없었다. 
3. 특정 거리 이상이 되면 움직임을 시작하게 만들자는 취지로 이 내용의 함수를 만들어놨는데 오히려 더 헷갈리고 직관적이지 않아서 안 쓰게 되었다. 
4. ik를 만들 때 가장 중요한 부분인 것 같은데, ik 관절들을 직접 수정하면 절대 안 된다. 발이 닿을 자리의 타겟만 움직여야 하고, ik는 이걸 따라가기만 해야한다. 
5.  목적지 타겟과 발이 닿을 자리를 지정하는 타겟을 구분해야 한다. 이걸 만들면서 코딩할 때 무엇을 염두에 두고 해야할까에 대해 나름대로 답을 얻은 것 같은데, 하나의 함수나 오브젝트는 하나의 기능만 해야한다는 것이다. 목적지 타겟은 몸이 향할 방향을 계산하는 용도, 발이 닿을 자리를 지정하는 타겟은는 ik의 끝이 위치할 부분을 지정한다. 발끝은 반드시 땅에 닿아있어야 공중부양하는 것처럼 움직이지 않는다.

## 정리하기
<iframe 
  width="80%" 
  height="400" 
  src="https://youtube.com/embed/IH4xad_IV98" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
</div>


정리한 구조는 이렇게 생겼다.
![](img/note/procedural/CCDIK_p3.png)

target(목적지 방향 계산용)

tip target(발 끝 당 하나)

다리 1,2 이렇게 있고 다리 안에는 그냥 평범한 ccdik 관절들

이 이미지에 비활성화된 오브젝트들... 시도하다가 실패한 흔적이다...


### 발을 움직이기 
1. `void Start`에서 발의 초기 위치를 저장한다. 정지해있을 때, 이동 후에 다시 정렬할 때 사용한다. 
2. `void Update` 에서 목적지까지의 방향을 구한다. 그리고 일정 거리 이상이 되면 이동한다. 일정거리 이하가 돼서 멈추면 발을 정렬한다. 


```
void Move()
{
FootUtil.RotBody(body, movingDir);
body.position = Vector3.Lerp(body.position, FootAvgPos(), Time.deltaTime * 5);

if (!isMoving)
moveCoroutine = StartCoroutine(moveForward());
}
```
isMoving일때도 몸은 계속 따라다녀야 자연스럽다.

```
IEnumerator moveForward()
{
isMoving = true;
  

float stepTime = 3f;
float stepHeight = 3f;

  

for (int i = 0; i < tipTargets.Length; i++)
{

Vector3 myIdealPos = body.TransformPoint(defaultLegOffsets[i]);
Vector3 targetPos = FootUtil.ForwardStride(myIdealPos, movingDir, stride);

//목표 위치는 몸통의 앞 + 보폭
targetPos = FootUtil.SetTargetGround(targetPos, ground);
yield return StartCoroutine(FootUtil.lerpMove(tipTargets[i], targetPos, stepTime, stepHeight));
tipTargets[i].position = targetPos;
}

yield return new WaitForSeconds(0.1f);
isMoving = false;
}
```

또 발을 이동시킬 때 자주 사용하던 함수들을 모아 FootUtil이라는 static class를 만들었다. 정면 일정 거리만큼 앞의 좌표를 반환하는 함수, 발을 들었다가 다시 바닥에 붙이는 함수, 발 아래에 콜라이더가 있는지 레이캐스트를 쏴보는 함수, 몸을 이동 타겟쪽으로 회전시키는 함수 등등을 모았다. 

이제 여기다가 몸이 회전할 때 발을 땅에 붙이고 있는 로직까지 추가하면 더 자연스러워질 것 같다.