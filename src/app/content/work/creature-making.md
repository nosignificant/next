---
date: 2025-11-26T00:00:00.000Z
tags:
  - code
title: 생물 만들기
---
<iframe 
  src="https://pixi-teal.vercel.app/" 
  width="100%" 
  height="600px" 
  style="border: none;"
  title="Pixi Project"
></iframe>
<p></p>

[링크](https://pixi-teal.vercel.app)


### phaser, pixiJS

p5js를 써서 만들고 있었는데 코드가 많아질수록 로딩이 길어지는 것 같아서 다른 라이브러리를 보고 있다. 

p5js는 html DOM canvas에 있는 canvas.getContext("2d")를 이용해 그래픽을 그리는 모양이다. pixiJS는 webGL 기반으로 GPU로 그림을 그리고 canvas에 보여주는 식인 것 같다. 
또 phaser이라는 webGL라이브러리가 있던데, 이건 본격적으로 게임을 만드는 사람을 위한 라이브러리 같았다.

[이곳](https://fgfactory.com/webgl-libraries-for-2d-games)에 비교가 되어 있어서 각각의 장단점을 쉽게 파악할 수 있었다. 
pixi - 일반적인 렌더링 엔진. 스크린 크기가 반응형으로 조절되지 않는다. 중력, 카메라 같은 엔진은 직접 구현해야 한다. 

phaser - 게임 개발 프레임워크.  pixi에 비해 파일 크기가 2배이다. 

나의 목적은 게임을 만든다기보단 생태계 시뮬레이션을 만드는 것이라, pixiJS를 선택했다. 이후에 필요한 것들은 라이브러리를 여러 개 붙여서 쓰자고 계획을 잡았다. 

## 기본 틀 잡아보기 
![스크린샷](/img/note/creature0.png)

배경에 보이지 않는 점을 깔아 좌표로 활용했다. 점을 기준으로 생물의 흥미도를 계산하고 다리를 놓을 지점을 만든다.

## 시행착오들

<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/hRn0u38ifm8" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
<p></p>
<iframe 
  width="100%" 
  height="400" 
  src="https://youtube.com/embed/zo2XErc7N4I" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
