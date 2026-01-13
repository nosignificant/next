---
date: 2026-01-13
tags:
  - code
  - procedural
---
<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/zApEExzkIV4" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>

1. root를 몸통에 붙을 쪽, head를 땅에 붙을 쪽으로 만들려고 했는데 잘 안돼서 그냥 root는 따라갈 목표와 거의 딱붙어있다. (root는 fabrik 정렬이 안 되어있다는 뜻) 그런데 이렇게하고 root - head 하니까 이동할 방향이 잘 나와서 그냥 어찌저찌 하고 있다. 언젠가는 고쳐야 할 것 같다.
2. 발이 Vector3.down으로 레이캐스트를 땅 아래쪽으로 쏴서 발이 땅에 붙어있는 게 기본인 상태고, 타겟과 몸이 멀어지면 "발을 떼는 동작"만 한다. 걷는 척하는 거다.
3. 몸 - 타겟이 멀어져서 발을 뻗어야하는 상태가 되면 
	- root - head (방향) 
	- 발걸음 거리 * 추가로 랜덤한 거리만큼 더 뻗음 
	이 두 개를 곱해서 위치를 지정한다.

언젠가는 대디롱레그를 만들어야지 
![](img/note/procedural/Daddy_stuck.gif)