let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

// create variables 
let engine, world, boxes = [], ground, circle;

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
app.renderer.view.style.margin='140px auto 0';
app.renderer.view.style.width='100%';
app.renderer.view.style.height='auto';
app.renderer.view.style.backgroundColor = '#c4f1f4';
document.body.appendChild(app.view);

let mouseposition = app.renderer.plugins.interaction.mouse.global;
function handleMousePressed() {
  boxes.push(new Box(mouseposition.x, mouseposition.y, 60, 60));
}

setup();

function setup() {
  //-------------------------------Matter
  engine = Matter.Engine.create();
  world = engine.world;
  // run the engine
  Matter.Engine.run(engine);

  // ------------------------------Background
  background = new PIXI.Graphics();
  background.beginFill('white', 0);
  background.drawRect(0, 0, 1000, 700);
  background.endFill();
  app.stage.addChild(background);
  background.interactive = true;
  background.on('pointerdown', handleMousePressed);

  // ------------------------------Ground

  ground = Matter.Bodies.rectangle(
    app.renderer.view.width/2,     // x
    app.renderer.view.height - 40, // y
    app.renderer.view.width,       // width
    80,                            // height
    {isStatic: true}
  );
  Matter.World.add(engine.world, ground);

  groundForm = new PIXI.Graphics();
  groundForm.beginFill('black');
  groundForm.drawRect(
    app.renderer.view.width/2,     // x
    ground.position.y,             // y
    app.renderer.view.width,       // width
    80,                            // height
  );
  groundForm.endFill();
  groundForm.pivot.set(groundForm.width/2, groundForm.height/2);
  app.stage.addChild(groundForm);

  // ------------------------------Circle
  circleForm = new PIXI.Graphics();
  circleForm.beginFill(0x9966FF);
  circleForm.drawCircle(0, 0, 32);
  circleForm.endFill();
  circleForm.x = 500;
  circleForm.y = 200;
  app.stage.addChild(circleForm);

  app.ticker.add(() => play());
}


play = () => {
  boxes.forEach(box => {
    box.show();
  });
  circleForm.x += 0.1;
}

