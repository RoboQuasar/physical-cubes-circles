let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

// create variables 
let engine,
  world,
  boxes = [],
  boundaries = [],
  circles = [],
  ground,
  CircleButton,
  CircleButtonTextStyle,
  CircleButtonText,
  clickType = 'box';

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

function handleButtonPressed(e) {
  e.target.scale.set(1.2, 1.2);

  if (clickType == 'circle') clickType = 'box';
  else if (clickType == 'box') clickType = 'circle';
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

  // ------------------------------Background
  background = new PIXI.Graphics();
  background.beginFill('white', 0);
  background.drawRect(0, 0, 1000, 700);
  background.endFill();
  app.stage.addChild(background);
  background.interactive = true;
  background.on('pointerdown', handleMousePressed);

  // ------------------------------Boundaries
  boundaries.push(new Boundary(350, 200, 400, 50, { angle: 0.4}));
  boundaries.push(new Boundary(650, 500, 400, 50, { angle: -0.4}));
  boundaries.push(new Boundary(
    app.renderer.view.width/2,
    app.renderer.view.height - 25,
    app.renderer.view.width,
    50,
  ));

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

  app.stage.addChild(CircleButton);
  CircleButton.interactive = true;
  CircleButton.buttonMode = true;
  CircleButton.on('pointerdown', handleButtonPressed);
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

  app.stage.addChild(RectangleButton);
  RectangleButton.interactive = true;
  RectangleButton.buttonMode = true;
  RectangleButton.on('pointerdown', handleButtonPressed);
  RectangleButton.on('pointerup', handleButtonUnpressed);

  app.ticker.add(() => play());
}

play = () => {
  boundaries.forEach(boundary => {
    boundary.show();
  });

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

  /* circleForm.x += 0.1; */
}

