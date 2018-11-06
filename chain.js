const ChainContainer = new PIXI.Container();

function Chain(x, y, n, r, length, fixed) {
  let prevCircle = null;
  let constraints = [];
  app.stage.addChild(ChainContainer);
  const constraintLine = new PIXI.Graphics();
  constraintLine.clear();
  ChainContainer.addChild(constraintLine);

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
  
      const constraint = Matter.Constraint.create(constraintOpt);
      constraints.push(constraint);
      Matter.World.add(engine.world, constraint);
    }

    prevCircle = circle;
  };

  this.remove = () => {
    constraintLine.clear();
    ChainContainer.removeChildren();
  }

  this.show = () => {
    constraintLine.clear();

    chainCircles.forEach((circle, i) => {
      if (i != 0) {
        constraintLine.lineStyle(3, 0xFF3300, 1, 0);
        constraintLine.beginFill(0x66CCFF);
        constraintLine.moveTo(circle.physicalBody.position.x, circle.physicalBody.position.y);
        constraintLine.lineTo(chainCircles[i-1].physicalBody.position.x, chainCircles[i-1].physicalBody.position.y);
        constraintLine.endFill(); 
      }

      circle.show();
    });
  }
};