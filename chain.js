const ChainContainer = new PIXI.Container();

function Chain(x, y, n, r, length, fixed) {
  let prevCircle = null;
  this.constraints = [];
  const constraintLine = new PIXI.Graphics();
  app.stage.addChild(constraintLine);
  
  for (let i = x; i < x + length; i+= length/n) {
    circle = new Circle(i, y, r, fixed && i == x);
    circles.push(circle);

    if (prevCircle) {
      const constraintOpt = {
        bodyA: circle.physicalBody,
        bodyB: prevCircle.physicalBody,
        length: 70,
        stiffness: 0.2,
      };
  
      this.constraint = Matter.Constraint.create(constraintOpt);
      this.constraints.push(this.constraint);
      Matter.World.add(engine.world, this.constraint);
    }

    prevCircle = circle;
  };

  this.mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(app.view),
  });

  this.mouseConstraintLine = new PIXI.Graphics();

  Matter.World.add(engine.world, this.mouseConstraint);
  app.stage.addChild(this.mouseConstraintLine);

  this.remove = () => {
    Matter.World.remove(engine.world, this.mouseConstraint);
    app.stage.removeChild(this.mouseConstraintLine);

    this.constraints.forEach((eachConstraint, i) => {
      Matter.World.remove(engine.world, eachConstraint);
      this.constraints.splice(i,1);
    });

    app.stage.removeChild(constraintLine);
  }

  this.show = () => {
    constraintLine.clear();

    this.constraints.forEach((constraint) => {
      constraintLine.lineStyle(3, 0xFF3300, 1, 0);
      constraintLine.beginFill(0x66CCFF);
  
      constraintLine.moveTo(constraint.bodyA.position.x, constraint.bodyA.position.y);
      constraintLine.lineTo(constraint.bodyB.position.x, constraint.bodyB.position.y);
      constraintLine.endFill();
    });

    circles.forEach((circle) => circle.show());


    if (this.mouseConstraint.body) {
      this.mouseConstraintLine.clear();
      this.mouseConstraintLine.lineStyle(3, 0x0F0F0, 1, 0);
      this.mouseConstraintLine.beginFill(0x0F0F0);
      this.mouseConstraintLine.moveTo(
        this.mouseConstraint.body.position.x + this.mouseConstraint.constraint.pointB.x,
        this.mouseConstraint.body.position.y + this.mouseConstraint.constraint.pointB.y,
      );
      this.mouseConstraintLine.lineTo(
        this.mouseConstraint.mouse.position.x,
        this.mouseConstraint.mouse.position.y,
      );
      this.mouseConstraintLine.endFill(); 

    } else {
      this.mouseConstraintLine.clear();
    }
  }
};