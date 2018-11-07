const ChainContainer = new PIXI.Container();

function Chain(x, y, n, r, length, fixed) {
  let prevCircle = null;
  let constraints = [];
  const constraintLine = new PIXI.Graphics();
  app.stage.addChild(constraintLine);
  
  for (let i = x; i < x + length; i+= length/n) {
    circle = new ChainCircle(i, y, r, (fixed && i == x));
    chainCircles.push(circle);

    if (prevCircle) {
      const constraintOpt = {
        bodyA: circle.physicalBody,
        bodyB: prevCircle.physicalBody,
        length: 70,
        stiffness: 0.2,
      };
  
      this.constraint = Matter.Constraint.create(constraintOpt);
      constraints.push(this.constraint);
      Matter.World.add(engine.world, this.constraint);
    }

    prevCircle = circle;
  };

  this.remove = () => {
    constraintLine.destroy();
    ChainContainer.visible = false;
    constraintLine.visible = false;
    console.log(constraintLine.visible);
    constraints.forEach((constraint) => {
      Matter.World.remove(engine.world, constraint);
    });
  }

  console.log(constraintLine.visible);
  

  this.show = () => {
    constraintLine.clear();
    constraintLine.lineStyle(3, 0xFF3300, 1, 0);
    constraintLine.beginFill(0x66CCFF);

    chainCircles.forEach((circle, i) => {
      if(i != 0) {
        constraintLine.moveTo(circle.physicalBody.position.x, circle.physicalBody.position.y);
        constraintLine.lineTo(
          chainCircles[i-1].physicalBody.position.x,
          chainCircles[i-1].physicalBody.position.y,
        );
      }
      circle.show();
    });

    constraintLine.endFill(); 
  }
};