---
date: 2025-12-30T00:00:00.000Z
tags:
  - code
  - procedural
title: inverse kinematics 2
---
[참고한 링크](https://github.com/zalo/MathUtilities/blob/master/Assets/IK/CCDIK/CCDIKJoint.cs)

CCD(Cyclic Coordinate Descent) 라는 IK(역운동학) 알고리즘을 활용한 로봇 팔이다.

## 기본 원리 

```
foreach joint in jointsTipToBase {   

// Point the effector towards the goal
	directionToEffector = effector.position - joint.position;
	directionToGoal = goal.position - joint.position;
	joint.rotateFromTo(directionToEffector, directionToGoal); 
}
```

1. 타겟을 향해 가리키기 
2. 맞는 축으로만 회전하기 
3. 회전각 제한하기 

회전시키려는 물체가 향하고 있는 방향을 특정 방향으로 회전시키는 게 중심인 ik인데, unity에서는 거의 FromTorRotatio(A, B)으로 해결하고 있다. 이 함수에 들어가는 첫번째 인자 A는 회전시킬 대상의 방향, B는 회전 목표 방향이다. 

정리하면 1번에서는 내가 보고 있는 방향을 타겟쪽으로 이동시킨다.
2번에서는 1번에서의 회전이 의도하지 않은 방향으로 회전한 게 있는지 확인하고 되돌려놓는다.
3번에서는 의도한 만큼 이상으로 회전했으면 돌려놓는다. 

## 타겟을 향해 가리키기 

각 관절에서 하는 일은 목적지를 향해 회전하는 것 밖에 없다. 이외의 추가적인 이동은 하지 않는다. 
목적지 - 출발지 = 방향이다.

```
transform.rotation = (rotateToDirection ?
Quaternion.FromToRotation(ToolTip.up, Target.forward) :
Quaternion.FromToRotation(ToolTip.position - transform.position,
Target.position - transform.position)) *
transform.rotation;
```

코드에서 tip은 손가락 끝이다. 손가락 끝 - 나 = 나로부터 손가락 끝까지의 방향(A)이 나온다.
그리고 타겟 - 나 = 타겟과 나의 방향(B)이 나온다. 이 두 개의 방향을 일치시킬 떄까지 돌린다.

여기서 회전 축을 제한하지 않으면 이렇게 된다.

<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/kO_nlSZmjqc" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
<p></p>

## 맞는 축으로만 회전하기 

```
transform.rotation = Quaternion.FromToRotation(transform.rotation * axis,
transform.parent.rotation * axis) * transform.rotation;
```

회전할 축에 1, 아닌축에 0을하고 곱한다. 
여기서 좀 헤맸는데, 기본은 from이 내 회전 방향(A)이고 to가 부모의 회전 방향(B)인 거였다.
내가 보고있는 방향이 부모와 같게 맞춘다는 거다. 

## 회전각 제한하기 

```
transform.rotation = Quaternion.FromToRotation(
transform.rotation * perpendicular,
(transform.rotation * perpendicular)
.ConstrainToNormal(
transform.parent.rotation * perpendicular, maxAngle)) * transform.rotation;
```

perpendicular은 수직인 축을 뜻한다. 
ConstrainToNormal(A,B)는 A축을 중심으로 B각도보다 이상 떨어져 있는지 확인한다.
떨어져 있으면 딱 최대 각도에 맞게 이동시킨다.

그래서 이 코드는 내 수직이 보고 있는 방향(A)이
부모의 수직축에서 최대 각도보다 더 이동했는지 확인하고 제한하는 식이다. 

<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/Xh8rGTFn4W0" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
<p></p>

## appendix

perpendicular이랑 constrainToNormal이 유니티 내장 기능인줄 알고 와 유니티 좋다 생각하고 있었는데 이 사람이 만들어 둔 거였다... 
c#에서는 static 클래스에 static 함수, 그리고 인자를 this로 받으면 그 클래스를 호출할 필요없이 바로 `axis.Perpendicular` 이렇게 적을 수 있다고 한다. 

```
public static Vector3 Perpendicular(this Vector3 vec){
return Mathf.Abs(vec.x) > Mathf.Abs(vec.z) ? new Vector3(-vec.y, vec.x, 0f)
: new Vector3(0f, -vec.z, vec.y);
}
```

```
public static Vector3 ConstrainToNormal(this Vector3 direction, Vector3 normalDirection, float maxAngle)
{
if (maxAngle <= 0f)
return normalDirection.normalized * direction.magnitude;

if (maxAngle >= 180f)
return direction;

float angle = Mathf.Acos(Mathf.Clamp(Vector3.Dot(direction.normalized, normalDirection.normalized), -1f, 1f)) * Mathf.Rad2Deg;

return Vector3.Slerp(direction.normalized, normalDirection.normalized, (angle - maxAngle) / angle) * direction.magnitude;
}
```
