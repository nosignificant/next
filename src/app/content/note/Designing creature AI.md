---
date: 2026-05-08
tags:
  - code
  - procedural
  - game_programming
title: 생물 이동 판단 기준 만들기
---

게임 개발을 하다 여러 부분에서 막막함을 느껴서 인터넷 서칭을하다 [game programming pattern](https://gameprogrammingpatterns.com/command.html) 을 발견하게 되었다. 간단하게 훑어보았는데, 지금까지 내가 작성한 코드를 유형화, 정리하고 발전시키는 데에 도움이 될 것 같아 꾸준히 읽어보려고 한다.
command가 1장의 첫번째 내용으로 들어가 있었는데, 가장 기본이 되는 이동 조작과 관련된 내용인 것 같아 그렇게 설정한 것 같다. 

## Command
위의 사이트에서는 command가 '실체화된 콜백 함수'라고 설명한다. [콜백 함수](https://ko.wikipedia.org/wiki/콜백)는 말그대로 '나중에 연락주세요'(call me back after~)하는 기능의 함수다. 특정 조건이 만족된 후 실행되는 함수라고 할 수 있다. 
이걸 왜 실체화 시키는 것일까? 

```
void InputHandler::handleInput() {
	if (isPressed(BUTTON_X)) jump();
	else if (isPressed(BUTTON_Y)) fireGun();
	else if (isPressed(BUTTON_A)) swapWeapon();
	else if (isPressed(BUTTON_B)) lurchIneffectively(); 
	}
```

일반적인 방식으로 작성된 코드는 x에 점프를 한다고 코드에 못박혀버려 나중에 버튼 x에 다른 기능을 할당할 수 없고, 유저 입장에서는 불편해진다. 이는 코드 실행 내용과 버튼-실행되는 내용을 정리한 표를 따로 구분해두면 해결할 수 있다. 

```
class Command {
public:   
	virtual ~Command() {}   
	virtual void execute() = 0; 
};
```
이게 행동이 실행되는 함수 부분, 

```
class InputHandler { 
	public:   
		void handleInput();    
	// Methods to bind commands...  
	private:   
		Command* buttonX_;   
		Command* buttonY_;   
		Command* buttonA_;   
		Command* buttonB_; 
};
```
이게 행동-버튼을 연결하는 핸들러부분이다. 
버튼과 행동을 재할당하고 싶으면 `buttonX_` 변수에 다른 `Command` 클래스를 저장해두면 된다. 
그리고 입력이 들어올 때마다 `if(isPressed(buttonX) buttonX_ -> execute())` 를 하면, `Command` 클래스 안에 있는 execute가 실행될 것이다. 

파일을 
1. 행동들
2. 행동을 수행하는 actor들
3. actor의 행동을 실시간으로 호출하는 파트(handler)
이렇게 정리하면 책임을 명확하게 분리할 수 있다. 

내 코드는 
1. 생물간의 관계가 정리된 파일
2. 생물
3. 이 생물이 다른 생물과 관계가 있는지 물어보는 파일
이렇게 정리되어 있다. 

```
public bool HasAction(CreatureID selfID, CreatureID targetID, InteractionAction action){
return GetActionPriority(selfID, targetID, action) > int.MinValue;
}
```

이 함수를  `Creature.cs` 쪽에서 

```
public bool HasAction(CreatureID targetCreatureId, InteractionAction action)
{
return interactionResolver != null && interactionResolver.HasAction(data.creatureID, targetCreatureId, action);
}
```
이렇게 가지고 있다. 

그리고 `Think.cs`에서 관계가 있는지 물어보고, 관계가 없으면 - wander, 도망치는 관계의 생물이 있으면 flee, 쫓아가야하는 대상이면 chase로 설정해두었다. 

그리고 `Think.cs` 내부에서는 이 생물 위치 정보를 통해 가장 이동하기 좋은 장소를 지정하고 그 지점으로 가도록 설정해두었는데, chase의 행동이 의도대로 움직이지 않는 경우가 많아 새로 고쳐야하는 상황이다. 


생물 인스턴스에는 지금 체력, 생물 종에 대한 정보, 지금 하고 있는 행동과 위치에 대한 정보를 담는다. 말 그대로 개별 생물에 대한 정보다. 

- 3월 개발 상황 

<iframe 
  width="80%" 
  height="400" 
  src="https://youtube.com/embed/VrW9nQh9S28"
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
</div>

- 4월 개발 상황
<iframe 
  width="80%" 
  height="400" 
  src="https://youtube.com/embed/CWsd-Kf2b8M"
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
</div>

