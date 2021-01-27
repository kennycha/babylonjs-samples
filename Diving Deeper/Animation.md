# Animation

> 1. Changing the object's properties during the rendering cycle
> 2. Animation method

## Terminology

1. Performer 

   - animation 을 행하는 대상

2. Frame

   - animation 을 이루는 단위 장면

3. Animation

   - Performer 가 수행할 동작들에 대한 기술 (`cf. script, film`)
   - **하나의 Animation 은 하나의 Property 만을 바꿀 수 있다**

4. Scripted Performer

   - Animation 들을 포함한 Performer

5. Performance

   - Performer 가 Animation 에 따라 동작들을 수행하는 것

6. Clip

   - Performance 의 가시적 결과물

   - 종류 

     1) game clip : 사용자의 카메라 조작 가능

     2) movie clip : 사용자의 카메라 조작 불가

## Animation 생성 방법

> 1. Animation constructor 로 생성
> 2. setKeys method 를 통해 key frames 및 values 추가 
> 3. Animation 을 performer 에 추가
> 4. Animation 실행

### Animation constructor 로 생성

```js
const frameRate = 10;
const xSlide = new BABYLON.Animation(	// Animation 생성자
  "xSlide",	// name
  "position",	// target property
  frameRate,	// fps
  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,	// data type
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,	// loop mode
  true	// enable blending (두 개 이상의 애니메이션을 조합해 실시간으로 새로운 애니메이션 생성)
);
```

### setKeys method 를 통해 key frames 및 values 추가 

```js
const keyFrames = []; 

keyFrames.push({	// keyframe 은 frame 과 value feild 를 갖는 object
	frame: 0,
  value: new BABYLON.Vector3(0, 1, 0)	// Animation 생성 시에 입력한 data type 과 일치해야 한다
});

keyFrames.push({
  frame: frameRate,
  value: new BABYLON.Vector3(3, 3, 0)
});

keyFrames.push({
  frame: 2 * frameRate,
  value: new BABYLON.Vector3(-3, -3, 0)
});
 
xSlide.setKeys(keyFrames);	// Animation 인스턴스의 setKeys method 를 통해 추가

```

### Animation 을 performer 에 추가

```js
const box = BABYLON.MeshBuilder.CreateBox("box", {});	// performer

box.animations.push(xSlide);	// performer 의 animation 에 추가
```

### Animation 실행

```js
scene.beginAnimation(	// Scene 인스턴스의 beginAnimation method 로 실행	
  box,	// target
  0,	// from (start frame)
  2 * frameRate,	// to (end frame)
  true	// loop
);
```

### cf) 한 Target 에 대해 여러 Animation 동시 실행

```js
const box = BABYLON.MeshBuilder.CreateBox("box", {});
const frameRate = 10;

// 두 개의 Animation 생성
const xSlide = new BABYLON.Animation(
  "xSlide",
  "position.x",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);

const ySlide = new BABYLON.Animation(
  "ySlide",
  "position.y",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);

const keyFrames = []; 

keyFrames.push({
  frame: 0,
  value: 2
});

keyFrames.push({
  frame: frameRate,
  value: -2
});

keyFrames.push({
  frame: 2 * frameRate,
  value: 2
});

xSlide.setKeys(keyFrames);
ySlide.setKeys(keyFrames);

scene.beginDirectAnimation(
  box,	// target
  [xSlide, ySlide],	// animations (두 애니메이션이 동시에 적용되어 결과적으로 Vector2 애니메이션을 적용하는 것과 동일하게 동작)
  0,	// from
  2 * frameRate,	// to
  true	// loop
);
```

## Animatable

> Animation 을 실행하는 method 는 `Animatable` object 를 반환
>
> 실행 중인 Animation 에 대한 조작을 method 로 지원

### Animation 조작

1. goToFrame
   - 해당 프레임으로 이동
2. pause
3. reset
4. restart
5. stop
   - animationName 을 인자로 넣어, 특정 Animation 만 정지 가능
6. syncWith
   - 길이가 다른 Animation 간 동기화

## Grouping Animations

> 여러 개의 Animation 들을 하나의 그룹으로 묶어서 조작

### Forming Groups

### AnimationGroup constructor 로 생성

```js
const animationGroup1 = new BABYLON.AnimationGroup(
  "Group1"	// groupName
);
const animationGroup2 = new BABYLON.AnimationGroup(
  "Group2"
);
```

### addTargetAnimation method 로 추가

```js
// animation, performer 를 인자로 addTargetAnimation method 호출하여 Group 에 추가
animationGroup1.addTargetedAnimation(animation1, mesh1);
animationGroup1.addTargetedAnimation(animation3, mesh1);
animationGroup1.addTargetedAnimation(animation2, mesh2);

animationGroup2.addTargetedAnimation(animation2, mesh3);
animationGroup2.addTargetedAnimation(animation1, mesh4);
animationGroup2.addTargetedAnimation(animation2, mesh4);
animationGroup2.addTargetedAnimation(animation3, mesh4);
```

### Normalize a Group

```js
animationGroup2.normalize(
  0,	// beginFrame
  100	// endFrame
);
```

- Animation 간 타임라인을 맞추기 위해 사용
- beginFrame 은 Group 내 모든 Animation 들의 시작 frame 보다 작거나 같다
- endFrame 은 Group 내 모든 Animation 들의 끝 frame 보다 크거나 같다

### Existing Animatables 로 AnimationGroup 생성

```js
const animationGroup = new BABYLON.AnimationGroup(
  "my-animation-group"	// groupName
);

for (anim of idleAnim.getAnimations()) {	// idleAnim 의 animations 를 iterate
  animationGroup.addTargetedAnimation(
    anim.animation,	// animation
    anim.target);	// performer
}
```



