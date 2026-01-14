---
date: 2026-01-14
tags:
  - code
  - procedural
---

![](img/note/procedural/CCDIK_p.png)

ccdik 활용하면 이런 관절을 만들 수 있을 것 같아서 도전했다...

<div classname="py-2 w-[250px]">

![](img/note/procedural/CCDIK_p1.png)

</div>
되긴 했는데 구조가 너무 복잡하다...

<div classname="py-2">

<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/i7can5TpDV0" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
</div>

그래서 그냥 타겟1 - 타겟2 해서 나온 방향으로 바라보는 코드로 한번 고쳐봤다...
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

그런데 구조가 비슷하게 복잡하고 세팅도 더 어려워져서 그냥 기존 코드대로 하기로 했다...

더 복잡해진 이유는 부모의 회전 값까지 고려를 해야해서 부모의 회전 상태를 무조건 xyz 000으로 맞춰야하는 게 어려운 점이었다. 
인스펙터 창에 일일히 들어가서 확인해야했기 때문이다...