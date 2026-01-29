---
date: 2025-06-24T00:00:00.000Z
tags:
  - code
title: piano
---

[ORCΛ](https://100r.co/site/orca.html)에서 영감을 받아 만든 글자 피아노이다. 글자를 아스키코드(숫자)로 변환해서 해당 아스키코드를 바탕으로 음원을 다양하게 조작했다.

[링크](https://nosignificant-piano.vercel.app)

  <iframe 
    src="https://nosignificant-piano.vercel.app" 
    width="170%" 
    height="750px" 
    style="transform: scale(0.6); transform-origin: 0 0;"
    title="piano"
  ></iframe>



<iframe 
  width="100%" 
  height="400" 
  src="https://www.youtube.com/embed/jFd2vXoP0H8" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>


구조는 이렇게 되어 있다.

![스크린샷](/img/note/studyPiano.png)


### 시행착오

1. 음악은 열, 작성은 행으로 하겠다는 계획을 처음부터 갖고 시작하지 않아서 애를 먹었다. 계획을 똑바로 하자.

2. 처음에 한 줄에 다 쓰고 낱자씩 잘라서 각각 div에 넣을지 그냥 input에 바로 쓸 수 있게 할지 고민했는데 input은 안에 들어가는 글(ref)이랑 값(useState)가 따로도는 것 같다. value 설정해주면 되는 것 같은데 굳이 두 번 손 가게 하지말자... 체감 상 input을 써서 일이 두 배로 늘어났다...
3. 구조를 grid > row > block으로 잡았는데 바로 grid > block으로 해도 됐을 것 같다. 직관적으로 전자처럼 생겼을것이고 저런 구조가 필요할 것이라 생각했는데 row에서 따로 처리해야할 건 없어서 그냥 props를 넘기는 단계만 하나 더 늘어난 셈이 됐다...

### 얻은 것

1. 위에 첨부한 이미지를 처음에는 그리지 못했는데 이걸 그리면서 프로젝트를 시작할 때 어떻게 구조를 짜고 들어가야 할지 배웠다.
2. 일반적으로 내가 생각했던? 배웠던 것과는 다르게 웹은 내부에서 값이 바뀜/표면에서 값이 바뀜 이 다르게 돌아가기 때문에 화면에 바뀐 값이 바로바로 업데이트 되지 않는다. 그래서 useState등등 과 같은 훅을 쓰는 것.

3. 여기서 사용하는 useState는 c++에서 배운 private, public에 비유할 수 있지 않을까 했다. 정확한 쓰임새는 다르지만 useState에서 `const [grid, setGrid] = useState<string[][]>(charGrid);`
   값이 이렇게 있으면 grid는 직접 접근하면 안되고(private?) 뒤의 함수를 통해서만 내부의 값을 바꿔야 한다는 점에서 (사실 그 이유는 직접 값을 바꾸면 리렌더가 안되기 때문이지만)
