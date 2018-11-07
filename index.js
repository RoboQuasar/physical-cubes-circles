document.addEventListener("DOMContentLoaded", () => {  
  document.getElementsByClassName('switch_to-rect')[0].addEventListener('click', handleSwitchToRect);
  document.getElementsByClassName('switch_to-chain')[0].addEventListener('click', handleSwitchToChain);
});

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

// create variables 
let engine,
  world,
  state,
  boxes = [],
  boundaries = [],
  circles = [],
  chainCircles = [],
  ground,
  chain = null,
  CircleButton,
  CircleButtonTextStyle,
  CircleButtonText,
  clickType = 'box',
  mouseConstraintLine,
  constraintLine;

//------------------------PIXI
PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new PIXI.Application({ 
    width: 1000, 
    height: 700,                       
    antialias: true, 
    transparent: true, 
  }
);

app.renderer.view.style.display = 'block';
app.renderer.view.style.margin='140px 40px 0';
app.renderer.view.style.width='calc(100% - 80px)';
app.renderer.view.style.height='auto';
app.renderer.view.style.backgroundColor = '#c4f1f4';
document.body.appendChild(app.view);

let mouseposition = app.renderer.plugins.interaction.mouse.global;

function handleMousePressed() {
  if (clickType == 'box') boxes.push(new Box(mouseposition.x, mouseposition.y, 60, 60));
  if (clickType == 'circle') circles.push(new Circle(mouseposition.x, mouseposition.y, 30));
}

function handleRectButtonPressed(e) {
  e.target.scale.set(1.2, 1.2);
  clickType = 'box';
}

function handleCircButtonPressed(e) {
  e.target.scale.set(1.2, 1.2);
  clickType = 'circle';
}

function handleButtonUnpressed(e) {
  e.target.scale.set(1, 1);
}

setup();

function setup() {
  //-------------------------------Matter
  engine = Matter.Engine.create();
  world = engine.world;
  Matter.Engine.run(engine);

  // ------------------------------Boundaries
  boundaries.push(new Boundary(350, 200, 400, 50, { angle: 0.4}));
  boundaries.push(new Boundary(650, 500, 400, 50, { angle: -0.4}));
  boundaries.push(new Boundary(
    app.renderer.view.width/2,
    app.renderer.view.height - 25,
    app.renderer.view.width,
    50,
  ));

  boundaries.forEach(boundary => {
    boundary.show();
  });

  RectAndCircSetup();
}

function RectAndCircSetup() {
  state = RectAndCircPlay;

  CircRectContainer = new PIXI.Container();
  app.stage.addChild(CircRectContainer);

  // ------------------------------Background
  background = new PIXI.Graphics();
  background.beginFill('white', 0);
  background.drawRect(0, 0, 1000, 700);
  background.endFill();
  CircRectContainer.addChild(background);
  background.interactive = true;
  background.on('pointerdown', handleMousePressed);

  // ------------------------------CircleButton
  CircleButton = new PIXI.Graphics();
  CircleButton.beginFill(0x9966FF);
  CircleButton.lineStyle(2, 0xFFDFFD, 1);
  CircleButton.drawCircle(0, 0, 32);
  CircleButton.endFill();
  CircleButton.x = 950;
  CircleButton.y = 40;

  CircleButtonTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 20,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 2,
  });
  
  CircleButtonText = new PIXI.Text("Круг!", CircleButtonTextStyle);
  CircleButtonText.position.set(-25, -15);
  CircleButton.addChild(CircleButtonText);

  CircRectContainer.addChild(CircleButton);
  CircleButton.interactive = true;
  CircleButton.buttonMode = true;
  CircleButton.on('pointerdown', handleCircButtonPressed);
  CircleButton.on('pointerup', handleButtonUnpressed);

  // ------------------------------RectangleButton
  RectangleButton = new PIXI.Graphics();
  RectangleButton.beginFill(0x9966FF);
  RectangleButton.lineStyle(2, 0xFFDFFD, 1);
  RectangleButton.drawRect(0, 0, 62, 62);
  RectangleButton.endFill();
  RectangleButton.pivot.set(0.5, 0.5);
  RectangleButton.x = 830;
  RectangleButton.y = 10;

  RectangleButtonTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 2,
  });
  
  RectangleButtonText = new PIXI.Text("Квадрат!", RectangleButtonTextStyle);
  RectangleButtonText.position.set(5, 20);
  RectangleButton.addChild(RectangleButtonText);

  CircRectContainer.addChild(RectangleButton);
  RectangleButton.interactive = true;
  RectangleButton.buttonMode = true;
  RectangleButton.on('pointerdown', handleRectButtonPressed);
  RectangleButton.on('pointerup', handleButtonUnpressed);

  app.ticker.add(() => state());
}

 //----------------------------------Chain
function ChainSetup() {
  state = ChainPlay;

  let prevCircle = null;
  let constraints = [];
  constraintLine = new PIXI.Graphics();
  app.stage.addChild(constraintLine);
  
  for (let i = 360; i < 600; i += 40) {
    circle = new ChainCircle(i, 35, 30, (i == 360));
    chainCircles.push(circle);

    if (prevCircle) {
      const constraintOpt = {
        bodyA: circle.physicalBody,
        bodyB: prevCircle.physicalBody,
        length: 70,
        stiffness: 0.2,
      };
  
      const constraint = Matter.Constraint.create(constraintOpt);
      constraints.push(constraint);
      Matter.World.add(engine.world, constraint);
    }

    prevCircle = circle;
  };

  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(app.view),
  });

  mouseConstraintLine = new PIXI.Graphics();

  Matter.World.add(engine.world, mouseConstraint);
  app.stage.addChild(mouseConstraintLine);

  app.ticker.add(() => state());
}

function RectAndCircPlay() {
  boxes.forEach((box, i) => {
    box.show();

    if (box.isOffScreen()) {
      box.remove();
      boxes.splice(i, 1);
    }
  });

  circles.forEach((circle, i) => {
    circle.show();

    if (circle.isOffScreen()) {
      circle.remove();
      circles.splice(i, 1);
    }
  });
}

function ChainPlay() {
  constraintLine.clear();
  constraintLine.lineStyle(3, 0xFF3300, 1, 0);
  constraintLine.beginFill(0x66CCFF);

  chainCircles.forEach((chainCircle, i) => {
    if(i != 0) {
      constraintLine.moveTo(chainCircle.physicalBody.position.x, chainCircle.physicalBody.position.y);
      constraintLine.lineTo(
        chainCircles[i-1].physicalBody.position.x,
        chainCircles[i-1].physicalBody.position.y,
      );
    }
    chainCircle.show();
  });
  constraintLine.endFill(); 

  if (mouseConstraint.body) {
    mouseConstraintLine.clear();
    mouseConstraintLine.lineStyle(3, 0x0F0F0, 1, 0);
    mouseConstraintLine.beginFill(0x0F0F0);
    mouseConstraintLine.moveTo(
      mouseConstraint.body.position.x + mouseConstraint.constraint.pointB.x,
      mouseConstraint.body.position.y + mouseConstraint.constraint.pointB.y,
    );
    mouseConstraintLine.lineTo(
      mouseConstraint.mouse.position.x,
      mouseConstraint.mouse.position.y,
    );
    mouseConstraintLine.endFill(); 

  } else {
    mouseConstraintLine.clear();
  }
}

function handleSwitchToRect() {
  app.renderer.clear('#c4f1f4');
  Matter.World.clear(engine.world);
  
  RectAndCircSetup();

/*   if (mouseConstraintLine) mouseConstraintLine.clear();

  chainCircles.forEach((chainCircle) => chainCircle.remove());
  circles.forEach((circle) => circle.remove());
  boxes.forEach((box) => box.remove());
  if (chain) chain.remove();

  Matter.World.remove(engine.world, mouseConstraint);
  app.stage.removeChild(mouseConstraintLine);

 */

}



function handleSwitchToChain() {
  app.renderer.clear('#c4f1f4');
  Matter.World.clear(engine.world);

  ChainSetup();

  /* 
  CircRectContainer.removeChildren();

  chainCircles.forEach((chainCircle) => chainCircle.remove());
  circles.forEach((circle) => circle.remove());
  boxes.forEach((box) => box.remove());
  if (chain) chain.remove(); */
}